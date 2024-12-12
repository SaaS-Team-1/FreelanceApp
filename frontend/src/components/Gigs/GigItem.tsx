import { Gig, User } from "@/utils/database/schema"; // Import updated interfaces
import { Badge, Button } from "flowbite-react";
import CustomButton from "../Buttons/CustomButton";

interface GigItemBaseProps {
  gig: Gig; // Use the Gig interface
  lister: User; // Include the user who listed the gig
  isSelected?: boolean;
  enableSelection?: boolean;
  showSeeMoreButton?: boolean;
  showStatus?: boolean;
  onSeeMoreClick?: (gig: Gig, lister: User) => void;
}

function GigItem({
  gig,
  lister,
  children,
  isSelected = false,
  enableSelection = false,
  showSeeMoreButton = false,
  showStatus = false,
  onSeeMoreClick = () => null,
}: React.PropsWithChildren<GigItemBaseProps>) {
  return (
    <div
      key={gig.gigId}
      className={`relative rounded-xl bg-surface-container-low shadow-sm transition-all duration-75 hover:bg-surface-container ${
        isSelected && "border-4 border-primary"
      } ${enableSelection ? "cursor-pointer" : ""} 
      `} // Hover effect applied conditionally
      onClick={() => enableSelection && onSeeMoreClick(gig, lister)} // Conditional click handler
    >
      <div className="mb-2 flex md:w-full items-center rounded-lg bg-primary-container p-2">
        <div className="ml-1 flex md:w-full flex-col">
          <h3 className="line-clamp-2 text-lg font-bold text-on-primary-container" id="gig-title">
            {gig.title.toUpperCase()}
          </h3>
          <div className="flex w-full">
            {gig.dueDate && (
              <p className="mt-1 text-xs text-on-primary-container">
                {new Date(gig.dueDate.seconds * 1000).toLocaleDateString(
                  "en-GB",
                  {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  },
                )}
              </p>
            )}
            {showStatus && (
              <Badge
                size="sm"
                className="ml-auto justify-self-end capitalize text-nowrap"
                color={
                  gig.status === "open"
                    ? "tertiary"
                    : gig.status === "in-progress"
                      ? "primary"
                      : gig.status === "awaiting-confirmation"
                        ? "warning"
                        : "surface-container"
                }
              >
                {gig.status}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <p className="my-4 line-clamp-4 w-full px-3 text-on-surface">
        {gig.description}
      </p>

      <div className="flex w-full items-center justify-center gap-2 p-3">
        <div className="mr-auto flex flex-col items-center justify-center space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
          <Badge size="sm" color="yellow">{`${gig.price} ⛃⛂`}</Badge>
          <Badge size="sm" color="secondary-container">
            {gig.category}
          </Badge>
          <Badge size="sm" color="secondary-container">
            {gig.location}
          </Badge>
        </div>

        {showSeeMoreButton && (
          <Button
            id="see-more-button"
            onClick={() => onSeeMoreClick(gig, lister)} // Open the modal with the selected gig
            color="primary"
            size="sm"
            className="size-fit text-nowrap"
          >
            See More
          </Button>
        )}
        {children}
      </div>
    </div>
  );
}

export default GigItem;
