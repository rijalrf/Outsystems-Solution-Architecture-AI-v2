

import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from '../types';

// New internal type for Gemini response which includes validation fields
type GeminiApiResponse = AnalysisResult & {
    isDesignFile: boolean;
    validationError: string | null;
};

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

const getResponseSchema = () => ({
  type: Type.OBJECT,
  properties: {
    isDesignFile: {
        type: Type.BOOLEAN,
        description: "Set to true if the uploaded file appears to be a software design, UI/UX wireframe, or mockup. Set to false if it seems to be an irrelevant document like a resume, article, or random text file."
    },
    validationError: {
        type: Type.STRING,
        description: "If 'isDesignFile' is false, provide a brief, user-friendly message explaining why the file is not suitable for analysis (e.g., 'The document does not appear to contain software designs or wireframes.'). If 'isDesignFile' is true, this MUST be null."
    },
    businessSummary: {
        type: Type.STRING,
        description: "A brief, high-level business summary of the application's purpose and main goals."
    },
    architecture: {
        type: Type.OBJECT,
        description: "Categorization of application components into the OutSystems 3-Layer Canvas: End-User, Core, and Foundation.",
        properties: {
            layers: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    required: ["name", "description", "modules"],
                    properties: {
                        name: { type: Type.STRING, description: "The name of the layer: 'End-User', 'Core', or 'Foundation'."},
                        description: { type: Type.STRING, description: "A brief description of the layer's purpose according to OutSystems best practices."},
                        modules: { 
                            type: Type.ARRAY,
                            description: "List of modules belonging to this layer. Each module should have a name and a specific description.",
                            items: { 
                                type: Type.OBJECT,
                                required: ["name", "description"],
                                properties: {
                                    name: { 
                                        type: Type.STRING, 
                                        description: "The name of the module. Should use standard OutSystems suffixes (e.g., _UI, _CS, _BL)."
                                    },
                                    description: {
                                        type: Type.STRING,
                                        description: "A brief description of this specific module's purpose and responsibilities."
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    entities: {
      type: Type.ARRAY,
      description: "List of data entities for the Entity Relationship Diagram (ERD).",
      items: {
        type: Type.OBJECT,
        required: ["name", "attributes", "description"],
        properties: {
          name: {
            type: Type.STRING,
            description: "The name of the data entity, e.g., 'User', 'Product'."
          },
          attributes: {
            type: Type.ARRAY,
            description: "List of attributes for the entity.",
            items: { 
                type: Type.OBJECT,
                required: ["name", "dataType"],
                properties: {
                    name: { type: Type.STRING, description: "The attribute name, e.g., 'Username', 'IsActive'."},
                    dataType: { type: Type.STRING, description: "The OutSystems data type, e.g., 'Text', 'Email', 'Boolean', 'Integer'."},
                    isPrimaryKey: { type: Type.BOOLEAN, description: "True if this attribute is the primary key."},
                    isForeignKey: { type: Type.BOOLEAN, description: "True if this attribute is a foreign key."}
                }
            }
          },
          description: {
            type: Type.STRING,
            description: "A brief description of the entity's purpose."
          }
        },
      },
    },
    relationships: {
        type: Type.ARRAY,
        description: "List of relationships between the entities.",
        items: {
            type: Type.OBJECT,
            required: ["fromEntity", "toEntity", "type", "description"],
            properties: {
                fromEntity: { type: Type.STRING, description: "The name of the source entity in the relationship."},
                toEntity: { type: Type.STRING, description: "The name of the target entity in the relationship."},
                type: { type: Type.STRING, description: "The type of relationship, e.g., '1-to-Many', '1-to-1'."},
                description: { type: Type.STRING, description: "A brief description of the relationship's purpose, e.g., 'A user can have multiple orders.'"}
            }
        }
    },
    staticEntities: {
        type: Type.ARRAY,
        description: "List of Static Entities for OutSystems. These are like enums or lookup tables with a predefined set of records.",
        items: {
            type: Type.OBJECT,
            required: ["name", "description", "attributes", "records"],
            properties: {
                name: { type: Type.STRING, description: "The name of the static entity, e.g., 'OrderStatus', 'UserType'." },
                description: { type: Type.STRING, description: "A brief description of the static entity's purpose." },
                attributes: {
                    type: Type.ARRAY,
                    description: "The attributes (columns) of the static entity, typically Id, Label, Order.",
                    items: {
                        type: Type.OBJECT,
                        required: ["name", "dataType"],
                        properties: {
                            name: { type: Type.STRING },
                            dataType: { type: Type.STRING }
                        }
                    }
                },
                records: {
                    type: Type.ARRAY,
                    description: "The list of predefined records (rows) for the static entity, where each record is a JSON string.",
                    items: {
                        type: Type.STRING,
                        description: "A JSON string representing a single record object, where keys match the defined attribute names. Example: '{\"Id\": 1, \"Label\": \"Active\", \"Order\": 1}'"
                    }
                }
            }
        }
    },
    asynchronousProcesses: {
        type: Type.OBJECT,
        description: "OPTIONAL: Identifies the need for asynchronous background tasks like scheduled jobs (Timers) or long-running workflows (BPT). Only include this section if the design implies such a need.",
        properties: {
            timers: {
                type: Type.ARRAY,
                description: "List of scheduled jobs (Timers).",
                items: {
                    type: Type.OBJECT,
                    required: ["name", "schedule", "description"],
                    properties: {
                        name: { type: Type.STRING, description: "A descriptive name for the Timer, e.g., 'DailyReportGenerator'."},
                        schedule: { type: Type.STRING, description: "The proposed schedule, e.g., 'Daily at 02:00 AM', 'Every 30 minutes'."},
                        description: { type: Type.STRING, description: "What the timer does, e.g., 'Generates and emails the daily sales report.'"}
                    }
                }
            },
            bptProcesses: {
                type: Type.ARRAY,
                description: "List of Business Process Technology (BPT) workflows.",
                items: {
                    type: Type.OBJECT,
                    required: ["name", "trigger", "steps"],
                    properties: {
                        name: { type: Type.STRING, description: "A descriptive name for the business process, e.g., 'OrderApprovalProcess'."},
                        trigger: { type: Type.STRING, description: "The event that starts this process, e.g., 'Creation of an Order record with TotalAmount > 1000'."},
                        steps: {
                            type: Type.ARRAY,
                            description: "A high-level list of steps in the process.",
                            items: { type: Type.STRING, description: "e.g., 'Wait for Manager Approval', 'Notify User of Status Change'."}
                        }
                    }
                }
            }
        }
    },
    serviceActions: {
      type: Type.ARRAY,
      description: "List of reusable server-side logic units (Service Actions). These are not directly exposed as REST APIs but are callable from other modules. They do not count as Application Objects.",
      items: {
        type: Type.OBJECT,
        required: ["name", "description", "inputs", "outputs"],
        properties: {
          name: {
            type: Type.STRING,
            description: "A descriptive name for the Service Action that MUST start with a verb, following OutSystems best practices. E.g., 'GetProductDetails', 'SubmitOrder'."
          },
          description: {
            type: Type.STRING,
            description: "A brief description of what the Service Action does."
          },
          inputs: {
            type: Type.ARRAY,
            description: "List of input parameters, e.g., 'ProductId (Integer)', 'OrderData (Record)'.",
            items: { type: Type.STRING }
          },
          outputs: {
            type: Type.ARRAY,
            description: "List of output parameters, e.g., 'Product (Record)', 'IsSuccess (Boolean)'.",
            items: { type: Type.STRING }
          }
        },
      },
    },
     consumedRestApis: {
      type: Type.ARRAY,
      description: "OPTIONAL: List of external REST APIs the application will consume. Each consumed REST API method counts as an Application Object. Only include this if the design implies integration with external services (e.g., payment gateways, mapping services).",
      items: {
        type: Type.OBJECT,
        required: ["name", "method", "path", "parameters", "description", "requestExample", "responseExample"],
        properties: {
          name: { type: Type.STRING, description: "A descriptive name for the consumed API method, e.g., 'ProcessStripePayment'." },
          method: { type: Type.STRING, description: "The HTTP method, e.g., 'GET', 'POST'." },
          path: { type: Type.STRING, description: "The full or partial URL path, e.g., 'https://api.stripe.com/v1/charges'." },
          parameters: { type: Type.ARRAY, description: "List of parameters (path, query, or body).", items: { type: Type.STRING } },
          description: { type: Type.STRING, description: "A brief description of what the API call does." },
          requestExample: { type: Type.STRING, description: "A JSON string example of the request body. Use an empty string for GET requests." },
          responseExample: { type: Type.STRING, description: "A JSON string example of a successful response body." }
        }
      }
    },
    roles: {
      type: Type.ARRAY,
      description: "List of user roles for access control within the application.",
      items: {
        type: Type.OBJECT,
        required: ["name", "description"],
        properties: {
          name: {
            type: Type.STRING,
            description: "The name of the user role, e.g., 'Administrator', 'StandardUser'."
          },
          description: {
            type: Type.STRING,
            description: "A brief description of the permissions and responsibilities of the role."
          }
        },
      },
    },
    screens: {
      type: Type.ARRAY,
      description: "List of application screens or pages visible in the design.",
      items: {
        type: Type.OBJECT,
        required: ["name", "description", "role"],
        properties: {
          name: {
            type: Type.STRING,
            description: "The name of the screen, e.g., 'Login Screen', 'Dashboard'."
          },
          description: {
            type: Type.STRING,
            description: "A brief description of the screen's purpose and functionality."
          },
          role: {
            type: Type.STRING,
            description: "The primary user role that can access this screen, e.g., 'Administrator', 'Public'."
          }
        },
      },
    },
    siteProperties: {
        type: Type.ARRAY,
        description: "List of Site Properties for OutSystems. These are global, configurable variables for the application.",
        items: {
            type: Type.OBJECT,
            required: ["name", "dataType", "defaultValue", "description"],
            properties: {
                name: { type: Type.STRING, description: "The name of the site property, e.g., 'APIBaseURL', 'DefaultPageSize'." },
                dataType: { type: Type.STRING, description: "The data type of the property, e.g., 'Text', 'Integer', 'Boolean'." },
                defaultValue: { type: Type.STRING, description: "The default value for the property." },
                description: { type: Type.STRING, description: "A brief description of the site property's purpose." }
            }
        }
    },
    thirdPartyRecommendations: {
        type: Type.ARRAY,
        description: "List of recommended third-party services or APIs based on detected application functionalities.",
        items: {
            type: Type.OBJECT,
            required: ["serviceName", "useCase", "recommendation"],
            properties: {
                serviceName: { type: Type.STRING, description: "The name of the recommended service, e.g., 'Google Maps API'." },
                useCase: { type: Type.STRING, description: "The specific functionality in the app that warrants this service, e.g., 'Displaying store locations'." },
                recommendation: { type: Type.STRING, description: "A brief explanation of why this service is a good fit." }
            }
        }
    },
    pluginRecommendations: {
      type: Type.ARRAY,
      description: "OPTIONAL: List of recommended OutSystems Forge plugins based on the design. Only include if a common Forge component can solve a need.",
      items: {
          type: Type.OBJECT,
          required: ["name", "description"],
          properties: {
              name: { type: Type.STRING, description: "The official name of the plugin on the OutSystems Forge, e.g., 'Ultimate PDF'." },
              description: { type: Type.STRING, description: "A brief description of why this plugin is recommended for the current application's needs." }
          }
      }
    },
  },
  required: ["isDesignFile", "validationError"],
});

export const analyzePdfForOutsystems = async (pdfFile: File, apiKey: string): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey });

  const pdfPart = await fileToGenerativePart(pdfFile);

  const textPart = {
    text: `
      You are an expert OutSystems Solution Architect. Your task is to analyze the provided Figma design PDF and generate a comprehensive solution architecture blueprint.

      **IMPORTANT VALIDATION STEP:**
      First, you MUST determine if the uploaded document is a valid software design file (like a wireframe, mockup, or UI design from Figma).
      - If the file IS a valid design, you MUST set "isDesignFile" to true and "validationError" to null. Then, proceed to generate the complete architecture analysis as requested below.
      - If the file is NOT a valid design (e.g., it's a resume, a text document, a random report), you MUST set "isDesignFile" to false and provide a user-friendly error message in "validationError". In this case, you MUST NOT generate any other architectural fields (like businessSummary, entities, etc.).

      Your analysis MUST strictly adhere to the principles, best practices, and patterns outlined in the official OutSystems documentation, which serves as your primary knowledge base. Refer to these sources:
      - Architecture Canvas: https://success.outsystems.com/documentation/11/app_architecture/designing_the_architecture_of_your_outsystems_applications/the_architecture_canvas/
      - Module Naming Conventions: https://www.outsystems.com/forums/discussion/59771/cheat-sheet-outsystems-module-naming-convention/
      - Service Actions: https://success.outsystems.com/documentation/outsystems_developer_cloud/app_architecture/service_actions/
      - Consuming REST APIs: https://success.outsystems.com/documentation/11/integration_with_external_systems/rest/consume_rest_apis/
      - Application Objects (AO): https://success.outsystems.com/support/licensing/application_objects/
      - OutSystems Forge & Forums: https://www.outsystems.com/forge/, https://www.outsystems.com/forums/

      Generate a response that precisely follows the provided JSON schema.

      - **Business Summary**: A high-level summary of the application's purpose.
      - **Architecture Canvas**: Decompose the application into a 3-Layer Canvas.
        - Provide a clear description for each of the three layers and each module within them.
        - **End-User Layer**: Contains UI elements (_UI).
        - **Core Layer**: Contains core business concepts, entities (_CS), and business logic (_BL).
        - **Foundation Layer**: Contains reusable, application-agnostic logic (_LIB, _IS, _API). **Crucially, this layer MUST always include a dedicated theme module for the application's styles (e.g., AppName_Th), as this is a fundamental OutSystems best practice.**
      - **Entities & Relationships**: Define a robust data model.
      - **Static Entities**: Correctly identify lookup data.
      - **Asynchronous Processes (OPTIONAL)**: Identify any need for background processing (Timers, BPT). Only include if clearly implied by the design.
      - **Roles & Permissions**: Define roles based on the Principle of Least Privilege.
      - **Service Actions**: Define reusable, server-side business logic as Service Actions. Their names MUST start with a verb (e.g., 'GetUserDetails', 'SubmitOrder'). These are not exposed as REST endpoints but are callable from other modules to enforce business rules consistently. **They do not count as Application Objects.**
      - **Consumed REST APIs (OPTIONAL)**: Identify any necessary integrations with external REST APIs (e.g., calling Google Maps, Stripe for payments). List these as Consumed REST APIs, as **they count towards Application Objects.** Only include this section if external integrations are clearly needed.
      - **Screens**: List all user-facing screens.
      - **Site Properties**: Recommend site properties for configurability.
      - **Third-Party Recommendations**: Suggest integrations where appropriate.
      - **Plugin Recommendations (OPTIONAL)**: Based on the application's needs, recommend relevant and popular plugins from the OutSystems Forge. For each recommendation, provide its official name and a description of why it's useful. Use the provided Forge and Forum links to ensure the plugin names are accurate and relevant.
    `
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [pdfPart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: getResponseSchema(),
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
        throw new Error("The AI model returned an empty response. Please try again.");
    }
    const rawResult = JSON.parse(jsonText) as GeminiApiResponse;

    if (rawResult.isDesignFile === false) {
        const infoMessage = rawResult.validationError || "The uploaded PDF does not appear to be a valid software design document. Please upload a PDF exported from Figma.";
        return { validationMessage: infoMessage };
    }


    // Post-process static entities to parse record strings into objects
    if (rawResult.staticEntities && Array.isArray(rawResult.staticEntities)) {
      rawResult.staticEntities.forEach((entity: any) => {
        if (entity.records && Array.isArray(entity.records)) {
          entity.records = entity.records.map((recordStr: string) => {
            // Guard against non-string or non-JSON-like string values
            if (typeof recordStr !== 'string' || !recordStr.trim().startsWith('{')) {
              return {};
            }
            try {
              return JSON.parse(recordStr);
            } catch (e) {
              console.warn(`Could not parse static entity record string: "${recordStr}"`, e);
              return {}; // Return an empty object if parsing fails
            }
          });
        }
      });
    }
    
    return rawResult as AnalysisResult;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error && error.message.includes('JSON')) {
       throw new Error(`Failed to analyze the PDF. The AI model returned an invalid format. Please try again or check the file content.`);
    }
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
    throw new Error(`Failed to analyze the PDF. The AI model could not process the request. Details: ${errorMessage}`);
  }
};