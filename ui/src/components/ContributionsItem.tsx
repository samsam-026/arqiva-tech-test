import { Contribution } from "@/models/contributions";
import { Card } from "react-bootstrap";

type ContributionItemProps = {
  item: Contribution;
};

export default function ContributionItem({ item, ...otherProps }: ContributionItemProps) {
  const { title, description, startTime, endTime } = item;
  return (
    <Card className="h-100" {...otherProps}>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text><i>By {item.owner}</i></Card.Text>
        <Card.Text>{new Date(startTime).toLocaleString()} - {new Date(endTime).toLocaleString()}</Card.Text>
        <hr />
        <Card.Text>{description}</Card.Text>
      </Card.Body>
    </Card>
  );
}
