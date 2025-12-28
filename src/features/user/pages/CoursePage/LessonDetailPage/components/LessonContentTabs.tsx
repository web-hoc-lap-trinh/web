import { 
  BookOutlined, 
  CodeOutlined, 
  LaptopOutlined
} from "@ant-design/icons";
import { Tabs } from "antd";
import type { ILesson } from "../../../../../../types/lesson.types";
import LessonExercisesTab from "./LessonExercisesTab";
import TryItYourselfRunner from "./TryItYourselfRunner";

interface LessonContentTabsProps {
  lesson: ILesson;
}

const CONTENT_STYLES = `
  prose prose-invert prose-lg max-w-none
  /* Headings */
  [&_h1]:text-white [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-6 [&_h1]:mt-8
  [&_h2]:text-white [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:border-b [&_h2]:border-white/10 [&_h2]:pb-2
  [&_h3]:text-emerald-300 [&_h3]:text-xl [&_h3]:font-medium [&_h3]:mb-3 [&_h3]:mt-6
  
  /* Paragraphs & Text */
  [&_p]:text-gray-300 [&_p]:leading-7 [&_p]:mb-4
  [&_strong]:text-white [&_strong]:font-bold
  [&_em]:text-gray-400 [&_em]:italic
  
  /* Links */
  [&_a]:text-emerald-400 [&_a]:no-underline [&_a]:border-b [&_a]:border-emerald-500/30 [&_a]:pb-0.5 hover:[&_a]:text-emerald-300 hover:[&_a]:border-emerald-300 hover:[&_a]:transition-colors
  
  /* Lists */
  [&_ul]:text-gray-300 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ul]:my-4 [&_ul_li::marker]:text-emerald-500
  [&_ol]:text-gray-300 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2 [&_ol]:my-4 [&_ol_li::marker]:text-emerald-500
  
  /* Code Inline */
  [&_code]:bg-[#0d2825] [&_code]:text-emerald-300 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:text-sm [&_code]:font-mono [&_code]:border [&_code]:border-emerald-500/20
  
  /* Code Blocks (Pre) */
  [&_pre]:bg-[#0a1514]! [&_pre]:border [&_pre]:border-white/10 [&_pre]:p-5 [&_pre]:rounded-xl [&_pre]:overflow-x-auto [&_pre]:my-6 [&_pre]:shadow-lg
  [&_pre_code]:bg-transparent [&_pre_code]:text-gray-200 [&_pre_code]:p-0 [&_pre_code]:border-none
  
  /* Blockquote */
  [&_blockquote]:border-l-4 [&_blockquote]:border-emerald-500 [&_blockquote]:bg-white/5 [&_blockquote]:py-3 [&_blockquote]:px-5 [&_blockquote]:rounded-r-lg [&_blockquote]:italic [&_blockquote]:text-gray-300 [&_blockquote]:my-6
  
  /* Images */
  [&_img]:rounded-xl [&_img]:shadow-lg [&_img]:my-8 [&_img]:border [&_img]:border-white/5
  
  /* Tables */
  [&_table]:w-full [&_table]:border-collapse [&_table]:my-6 [&_table]:overflow-hidden [&_table]:rounded-lg [&_table]:border [&_table]:border-white/10
  [&_th]:bg-white/5 [&_th]:text-white [&_th]:font-semibold [&_th]:p-4 [&_th]:text-left [&_th]:border-b [&_th]:border-white/10
  [&_td]:text-gray-300 [&_td]:p-4 [&_td]:border-b [&_td]:border-white/5 last:[&_td]:border-0
`;

const LessonContentTabs = ({ lesson }: LessonContentTabsProps) => {
  const items = [
    {
      key: 'content',
      label: (
        <span className="flex items-center gap-2">
          <BookOutlined /> Nội dung
        </span>
      ),
      children: (
        <div className="bg-[#051311] border border-white/10 rounded-2xl p-6 md:p-8 lg:p-10 shadow-xl shadow-black/20 min-h-[400px]">
          <div 
            className={CONTENT_STYLES}
            dangerouslySetInnerHTML={{ __html: lesson.content }}
          />
        </div>
      )
    },
    {
      key: 'playground',
      label: (
        <span className="flex items-center gap-2">
          <LaptopOutlined /> Code trực tiếp
        </span>
      ),
      children: (
        <div className="mt-2">
            <TryItYourselfRunner lessonId={lesson.lesson_id.toString()} />
        </div>
      )
    },
    {
      key: 'exercises',
      label: (
        <span className="flex items-center gap-2">
          <CodeOutlined /> Bài tập
        </span>
      ),
      children: (
        <LessonExercisesTab lessonId={lesson.lesson_id.toString()} />
      )
    },
  ];

  return (
    <div className="mt-8">
      <Tabs
        defaultActiveKey="content"
        size="large"
        items={items}
        className="
          [&_.ant-tabs-nav]:mb-6
          [&_.ant-tabs-nav]:before:border-b
          [&_.ant-tabs-nav]:before:border-white/10

          [&_.ant-tabs-tab]:text-gray-500!
          [&_.ant-tabs-tab]:text-base
          [&_.ant-tabs-tab]:px-4
          [&_.ant-tabs-tab]:py-3
          [&_.ant-tabs-tab]:transition-all
          [&_.ant-tabs-tab]:duration-300
          hover:[&_.ant-tabs-tab]:text-emerald-300

          [&_.ant-tabs-tab-active_.ant-tabs-tab-btn]:text-emerald-400!
          [&_.ant-tabs-tab-active_.ant-tabs-tab-btn]:font-semibold!
          [&_.ant-tabs-tab-active_.ant-tabs-tab-btn]:shadow-emerald-500/50!
          
          [&_.ant-tabs-ink-bar]:bg-emerald-500!
          [&_.ant-tabs-ink-bar]:h-[3px]!
          [&_.ant-tabs-ink-bar]:rounded-t-full!
          [&_.ant-tabs-ink-bar]:shadow-[0_-2px_10px_rgba(16,185,129,0.5)]
        "
      />
    </div>
  );
};

export default LessonContentTabs;