interface HeadingProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function Heading({ title, description, icon }: HeadingProps) {
  return (
    <div className="flex items-start mb-4">
      <div className="flex justify-center items-center rounded-lg w-12 h-12 bg-neutral-100 mr-3 shrink-0">{icon}</div>
      <div>
        <h1 className=" text-lg font-bold">{title}</h1>
        <small className="text-neutral-500">{description}</small>
      </div>
    </div>
  );
}
