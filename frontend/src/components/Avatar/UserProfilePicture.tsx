interface UserProfilePictureProps {
  displayName: string;
  picture: string;
  size?: "small" | "medium" | "large"; // Controls size of the component
  rounded?: boolean; // Controls if the picture should be rounded or not
}

const sizeClasses = {
  small: "w-8 h-8 text-sm",
  medium: "w-12 h-12 text-md",
  large: "w-16 h-16 text-lg",
};

function UserProfilePicture({
  user,
  size = "medium",
  rounded = true,
}: UserProfilePictureProps) {
  // Calculate initials from user's name
  const getInitials = (name: string) => {
    const initials = name
      ?.split(" ")
      .map((word) => word[0])
      .join("");
    return initials?.toUpperCase();
  };

  return (
    <div
      className={`${sizeClasses[size]} ${rounded ? "rounded-full" : "rounded-md"} flex items-center justify-center overflow-hidden bg-gray-300`}
    >
      {user.profile?.picture ? (
        // Display profile picture if available
        <img
          src={user.profile.picture}
          alt={user.displayName}
          className={`h-full w-full object-cover ${rounded ? "rounded-full" : "rounded-md"}`}
        />
      ) : (
        // Display initials if no profile picture is available
        <span className="font-bold text-white">
          {getInitials(user.displayName)}
        </span>
      )}
    </div>
  );
}

export default UserProfilePicture;
