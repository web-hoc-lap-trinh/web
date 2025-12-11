import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import { clsx } from "clsx";
import type { IExerciseOption } from "../../../../../../types/exercise.types";

interface ExerciseOptionProps {
  option: IExerciseOption;
  isSelected: boolean;
  isSubmitted: boolean;
  isCorrect?: boolean; 
  isUserSelected?: boolean; 
  onClick: () => void;
}

const ExerciseOption = ({ 
  option, 
  isSelected, 
  isSubmitted, 
  isCorrect, 
  isUserSelected,
  onClick 
}: ExerciseOptionProps) => {
  
  const getStyles = () => {
    if (!isSubmitted) {
      return isSelected
        ? "bg-emerald-500/20 border-emerald-500 text-emerald-100 ring-1 ring-emerald-500/50" 
        : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-emerald-500/30"; 
    }

    if (isCorrect) {
      return "bg-emerald-500/20 border-emerald-500 text-emerald-100"; 
    }
    if (isUserSelected && !isCorrect) {
      return "bg-red-500/20 border-red-500 text-red-100"; 
    }
    return "bg-white/5 border-white/10 text-gray-500 opacity-50"; 
  };

  return (
    <button
      disabled={isSubmitted}
      onClick={onClick}
      className={clsx(
        "w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-start gap-3 group relative",
        getStyles()
      )}
    >
      <div className={clsx(
        "flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold mt-0.5",
        !isSubmitted && isSelected ? "border-emerald-500 bg-emerald-500 text-white" : "border-white/20 bg-white/5",
        isSubmitted && isCorrect && "border-emerald-500 bg-emerald-500 text-white",
        isSubmitted && isUserSelected && !isCorrect && "border-red-500 bg-red-500 text-white"
      )}>
        {option.id}
      </div>
      
      <span className="flex-1 text-sm md:text-base font-medium">{option.text}</span>

      {isSubmitted && isCorrect && <CheckCircleFilled className="text-emerald-500 text-xl absolute right-4 top-4" />}
      {isSubmitted && isUserSelected && !isCorrect && <CloseCircleFilled className="text-red-500 text-xl absolute right-4 top-4" />}
    </button>
  );
};

export default ExerciseOption;