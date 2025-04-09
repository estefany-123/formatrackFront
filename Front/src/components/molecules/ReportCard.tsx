import { Card, CardContent } from "@/components/atoms/Card";

interface ReportCardProps {
  title: string;
  description: string;
  onClick: () => void;
}

export const ReportCard = ({
  title,
  onClick,
}: ReportCardProps) => (
  <Card
    className="cursor-pointer hover:shadow-lg transition-all border border-blue-500"
    onClick={onClick}
  >
    <CardContent className="p-4">
      <h3 className="text-lg font-bold mb-2">{title}</h3>
    </CardContent>
  </Card>
);
