import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type FormWrapperProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export function FormWrapper({
  title,
  description,
  children,
}: FormWrapperProps) {
  return (
    <Card className="mx-auto max-w-5xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <>{children}</>
      </CardHeader>
    </Card>
  );
}
