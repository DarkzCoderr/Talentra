export interface User {
  $id: string;
  email: string;
  name: string;
  interests: string[];
  background: string;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  goals?: string[];
  preferredCareer?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Career {
  $id: string;
  title: string;
  description: string;
  category: string;
  requiredSkills: string[];
  averageSalary: string;     // India ₹ LPA
  seniorSalary?: string;     // Senior level ₹ LPA
  growthRate: string;
  demandInIndia?: string;
  roadmap: RoadmapStep[];
  isHot: boolean;
  isEmerging?: boolean;
  isAISuggested?: boolean;
  aiWhyFit?: string;
  aiFitScore?: number;
  aiTimeToJob?: string;
}

export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  resources: Resource[];
  prerequisites?: string[];
  isCompleted: boolean;
}

export interface Resource {
  id: string;
  title: string;
  type: 'course' | 'book' | 'video' | 'article' | 'project';
  url?: string;
  description: string;
  isFree?: boolean;
}

export interface UserProgress {
  $id: string;
  userId: string;
  careerId: string;
  completedSteps: string[];
  currentStep: string;
  startDate: string;
  lastUpdated: string;
  completionPercentage: number;
}

// AI result stored in Appwrite for caching
export interface CachedAISuggestion {
  $id?: string;
  userId: string;
  suggestionsJson: string;   // JSON stringified AIAnalysisResult
  generatedAt: string;
}
