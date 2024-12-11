import React, { useState } from "react";
import UserProfilePicture from "@/components/Avatar/UserProfilePicture";
import { MdReport } from "react-icons/md";
import ErrorModal from "../Common/ErrorModal";
import { Badge, Tooltip } from "flowbite-react";
import * as Schema from "@/utils/database/schema";
import { User } from "firebase/auth";

interface ChatHeaderProps {
  user: User;
  chatPartner: Schema.User;
  status: string;
  gig: Schema.Gig;
  onSeeGigDetails: () => void;
  isLister: boolean;
}
const ChatHeader: React.FC<ChatHeaderProps> = ({
  user,
  status,
  onSeeGigDetails,
  gig,
  chatPartner,
  isLister,
}) => {
  const [openError, setOpenError] = useState(false);
  const reportMessage =
    "\n\n\n\n#####FOR SUPPORT AGENT - DO NOT DELETE#####" +
    "\nTimestamp:" +
    new Date().toISOString() +
    "\n" +
    JSON.stringify(gig, null, 2) +
    "\n" +
    "Chat Partner:" +
    "\n" +
    JSON.stringify(chatPartner, null, 2) +
    "\n" +
    "User:" +
    "\n" +
    user.uid;
  const [message, setMessage] = useState("Reason for report:");

  if (!chatPartner) return;

  return (
    <>
      <div className="flex w-full items-center justify-between border-b border-gray-700 bg-gray-800 p-4 text-white">
        <div className="flex items-center gap-4">
          <UserProfilePicture
            user={chatPartner}
            size="medium"
            hoverDetails={true}
          />
          <div>
            <span className="flex text-lg font-semibold text-blue-400">
              {chatPartner.displayName}
              <Tooltip content="Report" style="light">
                <a
                  href=""
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenError(true);
                  }}
                >
                  <MdReport className="mb-1 ml-1 inline text-red-500" />
                </a>
              </Tooltip>
            </span>
            <span
              className="block cursor-pointer text-sm text-orange-500 underline"
              onClick={onSeeGigDetails}
            >
              See gig details
            </span>
          </div>
        </div>
        <div className="font-bold">
          {" "}
          {isLister ? "Gig Status:  " : "Application Status:  "}
          <Badge color={isLister ? "secondary" : "primary"} size="sm">
            {status}
          </Badge>
        </div>
      </div>
      <ErrorModal openModal={openError} setOpenModal={setOpenError}>
        <div className="flex w-fit flex-col">
          <h1 className="mb-4 text-xl font-bold">Report User</h1>
          <span className="mb-4 text-sm ">
            If you wish to report a user, add the reason and send the generated
            email.
          </span>
          <textarea
            onChange={(e) => setMessage(e.target.value)}
            className="m-2 h-[20vh] w-[30vh] overflow-x-hidden overflow-y-scroll whitespace-pre-wrap text-pretty rounded-md bg-gray-100 text-left text-sm"
          >
            {message}
          </textarea>
          <div className="flex space-x-4">
            <a
              onClick={(e) => {
                e.preventDefault();
                window.open(
                  `mailto:support@gigs.com?subject=Error Report&body=${encodeURIComponent(message + reportMessage)}`,
                  "_blank",
                );
              }}
              href=""
              className="mt-4 w-full rounded-lg bg-red-500 py-2 text-white hover:bg-red-600"
            >
              Report
            </a>
          </div>
        </div>
      </ErrorModal>
    </>
  );
};

export default ChatHeader;
