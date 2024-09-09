interface HeaderProps {
  backgroundColor: string;
  foreColor: string;
  children?: React.ReactNode;
}
export default function Header({ backgroundColor, foreColor, children }: HeaderProps) {
  return (
    <header
      className="p-4 text-center flex justify-between items-center"
      style={{
        backgroundColor: backgroundColor,
        color: foreColor,
      }}
    >
      {children}
    </header>
  );
}
