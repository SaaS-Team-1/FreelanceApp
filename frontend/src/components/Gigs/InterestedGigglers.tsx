import React from "react";
import { User, Gig } from "@/utils/database/schema";
import CustomButton from "@/components/Buttons/CustomButton"; // Import your button component

interface InterestedGigglersProps {
  gig: Gig;
  users: User[]; // Full list of users to find applicants from
}

const InterestedGigglers: React.FC<InterestedGigglersProps> = ({ gig, users }) => {
  // Find the assigned giggler if there is one
  const assignedGiggler = users.find(user => user.userId === gig.selectedApplicantId);

  // Find other users who have applied for this gig based on `applicantIds` and exclude the assigned one
  const otherApplicants = users.filter(
    user => gig.applicantIds.includes(user.userId) && user.userId !== gig.selectedApplicantId
  );

  return (
    <div className="mt-6 rounded-lg bg-gray-900 p-4">
      {assignedGiggler && (
        <div className="mb-4">
          <h4 className="mb-2 mt-4 text-2xl font-semibold text-white">Assigned Giggler</h4>
          <div className="flex items-center justify-between p-2">
            <div
              className="flex cursor-pointer items-center"
              onClick={() => alert(`View profile of ${assignedGiggler.displayName}`)} // Trigger profile view on picture click
            >
              <img
                src={assignedGiggler.profile.picture || "https://via.placeholder.com/40"}
                alt={assignedGiggler.displayName}
                className="mr-3 size-10 rounded-full"
              />
              <span className="font-semibold text-white">{assignedGiggler.displayName} is assigned</span>
            </div>
            <div className="flex items-center space-x-2">
              <CustomButton
                label="Unassign"
                onClick={() => alert(`Unassigned ${assignedGiggler.displayName}`)}
                color="red"
                textColor="black"
                size="small"
                rounded={true}
              />
              <CustomButton
                label="Message"
                onClick={() => alert(`Message ${assignedGiggler.displayName}`)}
                color="primary"
                textColor="black"
                size="small"
                rounded={true}
              />
            </div>
          </div>
        </div>
      )}

      {/* Add a white line above the "Interested Gigglers" section */}
      {assignedGiggler && <div className="mb-4 border-t-2 border-white"></div>}

      <h4 className="mb-2 text-2xl font-semibold text-white">Interested Gigglers</h4>
      <div>
        {otherApplicants.length > 0 ? (
          otherApplicants.map((applicant, index) => (
            <div key={applicant.userId} className="p-2">
              <div className="flex items-center justify-between">
                <div
                  className="flex cursor-pointer items-center"
                  onClick={() => alert(`View profile of ${applicant.displayName}`)} // Trigger profile view on picture click
                >
                  <img
                    src={applicant.profile.picture || "https://via.placeholder.com/40"}
                    alt={applicant.displayName}
                    className="mr-3 size-10 rounded-full"
                  />
                  <span className="text-white">{applicant.displayName}  has shown interest in this Gig</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CustomButton
                    label="Assign Gig"
                    onClick={() => alert(`Assigned to ${applicant.displayName}`)}
                    color="green"
                    textColor="black"
                    size="small"
                    rounded={true}
                  />
                  <CustomButton
                    label="Message"
                    onClick={() => alert(`Message ${applicant.displayName}`)}
                    color="primary"
                    textColor="black"
                    size="small"
                    rounded={true}
                  />
                </div>
              </div>
              {index < otherApplicants.length - 1 && <div className="my-2 border-t border-white"></div>}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No other applicants yet.</p>
        )}
      </div>
    </div>
  );
};

export default InterestedGigglers;
