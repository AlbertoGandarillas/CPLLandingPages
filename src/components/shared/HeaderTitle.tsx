interface HeaderTitleProps {
  hideCollegeName: boolean;
  college: string;
}
export default function HeaderTitle({
  hideCollegeName,
  college
}: HeaderTitleProps) {
  return (
    <div className="flex flex-col">
      <h1 className="text-4xl font-bold ml-4">
        {hideCollegeName ? "" : college}
      </h1>
    </div>
  );
}
