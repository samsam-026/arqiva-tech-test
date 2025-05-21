import { Contribution } from "@/models/contributions";
import { Badge, Card } from "react-bootstrap";

type ContributionItemProps = {
  item: Contribution;
};

const enum ContributionState {
  Scheduled = "Scheduled",
  Active = "Active",
  Complete = "Complete"
}

const ContributionStateMap = new Map<ContributionState, string>([
  [ContributionState.Scheduled, "success"],
  [ContributionState.Active, "warning"],
  [ContributionState.Complete, "secondary"]
]);

const timeFormatter = new Intl.DateTimeFormat("en-GB", {
  minute: "2-digit",
  hour: "2-digit"
});

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "long"
});

export default function ContributionItem({ item, ...otherProps }: ContributionItemProps) {
  const { title, description, startTime, endTime } = item;
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);

  let state = ContributionState.Scheduled;
  if (end < now) {
    state = ContributionState.Complete;
  } else if (start < now) {
    state = ContributionState.Active;
  }

  return (
    <Card className="h-100" {...otherProps}>
      <Card.Body>
        <p className="text-right">
          {dateFormatter.format(start)}, {timeFormatter.format(start)} - {timeFormatter.format(end)}
          <Badge pill bg={ContributionStateMap.get(state)} className="float-end">
            {state}
          </Badge>
        </p>
        <Card.Title className="mb-1">{title}</Card.Title>
        <Card.Text>
          <i>by {item.owner}</i>
        </Card.Text>
        <Card.Text>{description}</Card.Text>
      </Card.Body>
    </Card>
  );
}
