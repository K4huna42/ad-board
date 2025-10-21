export interface DadataSuggestion {
  data: {
    city: string;
  };
}

export interface DadataResponse {
  suggestions: DadataSuggestion[];
}
