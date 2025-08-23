export interface Attribute {
  name: string;
  dataType: string;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
}

export interface Entity {
  name: string;
  attributes: Attribute[];
  description: string;
}

export interface Relationship {
  fromEntity: string;
  toEntity: string;
  type: string;
  description: string;
}

export interface ServiceAction {
  name: string;
  description: string;
  inputs: string[];
  outputs: string[];
}

export interface ConsumedRestApi {
  name: string;
  method: string;
  path: string;
  parameters: string[];
  description: string;
  requestExample: string;
  responseExample:string;
}

export interface Role {
  name:string;
  description: string;
}

export interface Page {
  name: string;
  description: string;
  role: string;
}

export interface StaticEntity {
  name: string;
  description: string;
  attributes: { name: string; dataType: string }[];
  records: Array<{[key: string]: string | number | boolean}>;
}

export interface SiteProperty {
  name: string;
  dataType: string;
  defaultValue: string;
  description: string;
}

export interface Module {
  name: string;
  description: string;
}

export interface ArchitectureLayer {
    name: string; // e.g., "End-User", "Core", "Foundation"
    description: string;
    modules: Module[]; // e.g., [{name: "ProductScreen_UI", description: "Handles product display"}]
}

export interface Architecture {
    layers: ArchitectureLayer[];
}

export interface ThirdPartyServiceRecommendation {
  serviceName: string;
  useCase: string;
  recommendation: string;
}

export interface Timer {
  name: string;
  schedule: string;
  description: string;
}

export interface BPTProcess {
  name: string;
  trigger: string;
  steps: string[];
}

export interface AsynchronousProcesses {
  timers?: Timer[];
  bptProcesses?: BPTProcess[];
}

export interface AnalysisResult {
  businessSummary: string;
  architecture?: Architecture;
  entities: Entity[];
  relationships: Relationship[];
  staticEntities: StaticEntity[];
  roles: Role[];
  serviceActions: ServiceAction[];
  consumedRestApis?: ConsumedRestApi[];
  pages: Page[];
  siteProperties: SiteProperty[];
  thirdPartyRecommendations?: ThirdPartyServiceRecommendation[];
  asynchronousProcesses?: AsynchronousProcesses;
}