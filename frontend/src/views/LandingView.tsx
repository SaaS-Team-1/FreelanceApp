import { Button } from "flowbite-react";
import { Link } from "react-router";

const LandingPage = () => {
  return (
    <div className="w-full bg-surface text-on-surface">
      <div className="w-full bg-primary text-on-primary">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
            <div>
              <h1 className="mb-4 text-4xl font-bold">
                UniGigs, By Students For Students
              </h1>

              <p className="mb-8 text-xl">
                Need help with tutoring, moving, or rides? Find trusted students
                ready to help on your campus.
              </p>

              <div className="flex items-center space-x-4">
                <Button
                  color="surface-container"
                  to={"login?register=1"}
                  as={Link}
                  className="text-on-surface"
                >
                  Get Started
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <img src="/homepage.webp" className="rounded-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full bg-surface py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-3xl font-bold">How It Works</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                title: "Post Your Gig",
                description:
                  "Describe what you need help with and set your budget",
                icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
              },
              {
                title: "Connect with Others",
                description: "Review profiles and chat with verified students",
                icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
              },
              {
                title: "Get It Done",
                description:
                  "Complete the gig and pay securely through our platform",
                icon: "M5 13l4 4L19 7",
              },
            ].map((feature, index) => (
              <div key={index} className="p-6 text-center">
                <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary-container">
                  <svg
                    className="size-8 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d={feature.icon}
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-on-surface-variant">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Categories */}
      <div className="w-full bg-surface-variant py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Popular Categories
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { title: "Tutoring", description: "Math, Science, Languages" },
              { title: "Moving Help", description: "Dorm & Apartment Moves" },
              { title: "Rides", description: "Airport, Shopping, Events" },
              { title: "Tasks", description: "Errands, Deliveries, Setup" },
            ].map((category, index) => (
              <div
                key={index}
                className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-xl"
              >
                <h3 className="mb-2 font-semibold">{category.title}</h3>
                <p className="text-sm text-on-surface-variant">
                  {category.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full bg-primary py-16 text-on-primary">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold">Ready to Get Started?</h2>
          <p className="text-xl">
            Join thousands of students helping each other succeed
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
