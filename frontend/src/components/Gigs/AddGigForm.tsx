// "use client";

import { Button, Label, Modal, Textarea, TextInput } from "flowbite-react";
import { useState } from "react";
import { ConfirmButton } from "@/components/Buttons/ConfirmButton"; // Adjust the path as needed
import { CancelButton } from "@/components/Buttons/CancelButton"; // Adjust the path as needed

export function AddGig() {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleClose = () => setIsOpen(false);

  return (
    <>
      <div className="flex min-h-[50vh] items-center justify-center">
        <Button onClick={() => setIsOpen(true)}>Add A GIG</Button>  // to add a gig 
      </div>

      {/* Modal */}
      <Modal show={isOpen} onClose={handleClose} size="md">
        <Modal.Header>
          <span className="text-xl font-semibold">Add A GIG</span>
        </Modal.Header>
        <Modal.Body>
          <form className="space-y-4">
            {/* Title Field */}
            <div>
              <Label htmlFor="title" value="Title :" className="text-sm font-medium" />
              <TextInput
                id="title"
                name="title"
                placeholder="Enter title"
                className="mt-1 w-full rounded-lg"
              />
            </div>

            {/* Description Field */}
            <div>
              <Label htmlFor="description" value="Description :" className="text-sm font-medium" />
              <Textarea
                id="description"
                name="description"
                placeholder="Enter description"
                rows={4}
                className="mt-1 w-full rounded-lg"
              />
            </div>

            {/* Price Field */}
            <div>
              <Label htmlFor="price" value="Price :" className="text-sm font-medium" />
              <TextInput
                id="price"
                name="price"
                placeholder="Enter price"
                type="number"
                className="mt-1 w-full rounded-lg"
              />
            </div>

            {/* Categories Field */}
            <div>
              <Label htmlFor="categories" value="Categories:" className="text-sm font-medium" />
              <TextInput
                id="categories"
                name="categories"
                placeholder="Enter category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                onBlur={() => setSelectedCategory(category)}
                className="mt-1 w-full rounded-lg"
              />
              {selectedCategory && (
                <p className="mt-1 text-sm text-gray-700">
                  Selected Category: {selectedCategory}
                </p>
              )}
            </div>

            {/* Due Date Field */}
            <div>
              <Label htmlFor="dueDate" value="Due Date :" className="text-sm font-medium" />
              <TextInput
                id="dueDate"
                name="dueDate"
                type="date"
                className="mt-1 w-full rounded-lg"
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer className="flex justify-between">
          {/* Use the imported ConfirmButton and CancelButton */}
          <CancelButton />
          <ConfirmButton />
        </Modal.Footer>
      </Modal>
    </>
  );
}
