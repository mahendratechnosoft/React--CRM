import React, { useEffect, useState } from "react";
import { Button, Form, ListGroup, Spinner, Card } from "react-bootstrap";
import { FaTrash, FaPen } from "react-icons/fa";
import { toast } from "react-toastify";
import axiosInstance from "../../../BaseComponet/axiosInstance";

const AddParts = () => {
  const [partInput, setPartInput] = useState("");
  const [partList, setPartList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchExistingParts();
  }, []);

  const fetchExistingParts = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/work/getAllParts");
      setPartList(res.data || []);
    } catch (error) {
      toast.error("Failed to load parts");
    } finally {
      setLoading(false);
    }
  };

  const handleAddPart = async () => {
    const partName = partInput.trim();
    if (!partName) return;

    if (
      partList.some((p) => p.partName.toLowerCase() === partName.toLowerCase())
    ) {
      toast.info("This part already exists");
      return;
    }

    try {
      const res = await axiosInstance.post(`/work/addPart/${partName}`);
      if (res.data) {
        setPartList([...partList, res.data]);
        setPartInput("");
        toast.success("Part added successfully");
      }
    } catch (error) {
      if (error.response?.status === 409) {
        toast.warning("Part already exists in DB");
      } else {
        toast.error("Failed to add part");
      }
    }
  };

  const handleEditClick = (item) => {
    setPartInput(item.partName);
    setEditId(item.partId);
    setEditMode(true);
  };

  const handleUpdatePart = async () => {
    const updatedName = partInput.trim();
    if (!updatedName) return;

    try {
      const res = await axiosInstance.put(`/work/updatePart/${editId}`, {
        partName: updatedName,
      });

      if (res.data) {
        setPartList((prev) =>
          prev.map((item) =>
            item.partId === editId ? { ...item, partName: updatedName } : item
          )
        );
        toast.success("Part updated successfully");
        resetInput();
      }
    } catch (error) {
      toast.error("Failed to update part");
    }
  };

  const handleDelete = async (partId) => {
    try {
      const res = await axiosInstance.delete(`/work/deletePart/${partId}`);
      if (res.status === 200) {
        setPartList((prev) => prev.filter((item) => item.partId !== partId));
        toast.success("Part deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete part");
    }
  };

  const resetInput = () => {
    setPartInput("");
    setEditMode(false);
    setEditId(null);
  };

  return (
    <Card className="p-3 shadow-sm">
      <h5 className="mb-3">Manage Parts</h5>

      {/* Input + Buttons */}
      <Form
        className="d-flex mb-3"
        onSubmit={(e) => {
          e.preventDefault();
          editMode ? handleUpdatePart() : handleAddPart();
        }}
      >
        <Form.Control
          type="text"
          placeholder="Enter part name"
          value={partInput}
          onChange={(e) => setPartInput(e.target.value)}
          autoFocus
        />
        {editMode ? (
          <>
            <Button
              variant="warning"
              className="ms-2"
              onClick={handleUpdatePart}
            >
              Update
            </Button>
            <Button variant="secondary" className="ms-2" onClick={resetInput}>
              Cancel
            </Button>
          </>
        ) : (
          <Button variant="success" className="ms-2" onClick={handleAddPart}>
            Add
          </Button>
        )}
      </Form>

      {/* ✅ Parts List */}
      <h6 className="mb-2">Parts List</h6>
      <div
        style={{
          maxHeight: "300px",
          overflowY: "auto",
          border: "1px solid #ddd",
          borderRadius: "5px",
        }}
      >
        {/* Header row */}
        <div className="d-flex justify-content-between fw-bold bg-light p-2 border-bottom">
          <span>Part Name</span>
          <span>Actions</span>
        </div>

        {loading ? (
          <div className="text-center p-3">
            <Spinner animation="border" size="sm" /> Loading...
          </div>
        ) : partList.length > 0 ? (
          <ListGroup variant="flush">
            {partList.map((item) => (
              <ListGroup.Item
                key={item.partId}
                className="d-flex justify-content-between align-items-center"
              >
                {item.partName}
                <div className="d-flex gap-2">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleEditClick(item)}
                  >
                    <FaPen />
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(item.partId)}
                  >
                    <FaTrash />
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <div className="text-muted text-center p-3">No parts added yet.</div>
        )}
      </div>
    </Card>
  );
};

export default AddParts;
