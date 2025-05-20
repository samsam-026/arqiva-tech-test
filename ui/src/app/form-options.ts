export enum ContributionOrder {
    Id = "id",
    Title = "title",
    Description = "description",
    StartTime = "startTime",
    EndTime = "endTime",
    Owner = "owner",
}

export const ContributionOrderOptions = new Map<ContributionOrder, string>([
    [ContributionOrder.Id, "Id"],
    [ContributionOrder.Title, "Title"],
    [ContributionOrder.Description, "Description"],
    [ContributionOrder.StartTime, "Start Time"],
    [ContributionOrder.EndTime, "End Time"],
    [ContributionOrder.Owner, "Owner"],
]);

