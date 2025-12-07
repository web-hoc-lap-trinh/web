export const getDifficultyColor = (level: string) => {
  switch (level) {
    case "BEGINNER": return "green";
    case "INTERMEDIATE": return "blue";
    case "ADVANCED": return "red";
    default: return "default";
  }
};

export const getDifficultyLabel = (level: string) => {
    switch (level) {
      case "BEGINNER": return "Cơ bản";
      case "INTERMEDIATE": return "Trung bình";
      case "ADVANCED": return "Nâng cao";
      default: return "Khác";
    }
  };