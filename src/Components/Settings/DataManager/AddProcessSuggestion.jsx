import React, { useEffect, useState } from "react";
import { Button, Form, ListGroup, Spinner, Card } from "react-bootstrap";
import { FaTrash, FaPen } from "react-icons/fa";
import { toast } from "react-toastify";
import axiosInstance from "../../../BaseComponet/axiosInstance";

const AddProcessSuggestion = () => {
  const [processInput, setProcessInput] = useState("");
  const [processList, setProcessList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchExistingProcesses();
  }, []);

  const fetchExistingProcesses = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/work/getAllProcesses");
      setProcessList(res.data || []);
    } catch (error) {
      toast.error("Failed to load processes");
      console.error("Error fetching processes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProcess = async () => {
    const processName = processInput.trim();
    if (!processName) {
      toast.info("Process name cannot be empty.");
      return;
    }

    if (
      processList.some(
        (p) => p.processName.toLowerCase() === processName.toLowerCase()
      )
    ) {
      toast.info("This process already exists.");
      return;
    }

    try {
      const res = await axiosInstance.post(`/work/addProcess/${processName}`);
      if (res.data) {
        setProcessList([...processList, res.data]);
        setProcessInput("");
        toast.success("Process added successfully!");
      }
    } catch (error) {
      if (error.response?.status === 409) {
        toast.warning("Process already exists in the database.");
      } else {
        toast.error("Failed to add process.");
      }
      console.error("Error adding process:", error);
    }
  };

  const handleEditClick = (item) => {
    setProcessInput(item.processName);
    setEditId(item.processId);
    setEditMode(true);
  };

  const handleUpdateProcess = async () => {
    const updatedName = processInput.trim();
    if (!updatedName || !editId) return;

    try {
      const res = await axiosInstance.put(`/work/updateProcess/${editId}`, {
        processName: updatedName,
      });

      if (res.data) {
        setProcessList((prev) =>
          prev.map((item) => (item.processId === editId ? res.data : item))
        );
        toast.success("Process updated successfully!");
        resetInput();
      }
    } catch (error) {
      toast.error("Failed to update process.");
      console.error("Error updating process:", error);
    }
  };

  const handleDeleteProcess = async (processId) => {
    try {
      const res = await axiosInstance.delete(
        `/work/deleteProcess/${processId}`
      );
      if (res.status === 200) {
        setProcessList((prev) =>
          prev.filter((item) => item.processId !== processId)
        );
        toast.success("Process deleted successfully!");
      }
    } catch (error) {
      toast.error("Failed to delete process. It may be in use.");
      console.error("Error deleting process:", error);
    }
  };

  const resetInput = () => {
    setProcessInput("");
    setEditMode(false);
    setEditId(null);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editMode) {
      handleUpdateProcess();
    } else {
      handleAddProcess();
    }
  };

  return (
    <Card className="p-3 shadow-sm">
      <h5 className="mb-3">Manage Process Suggestions</h5>

      {/* Input Form */}
      <Form className="d-flex mb-3" onSubmit={handleFormSubmit}>
        <Form.Control
          type="text"
          placeholder="Enter process name"
          value={processInput}
          onChange={(e) => setProcessInput(e.target.value)}
          autoFocus
        />
        {editMode ? (
          <>
            <Button variant="warning" className="ms-2" type="submit">
              Update
            </Button>
            <Button variant="secondary" className="ms-2" onClick={resetInput}>
              Cancel
            </Button>
          </>
        ) : (
          <Button variant="success" className="ms-2" type="submit">
            Add
          </Button>
        )}
      </Form>

      {/* ✅ Process List */}
      <h6 className="mb-2">Process Suggestions List</h6>
      <div
        style={{
          maxHeight: "300px",
          overflowY: "auto",
          border: "1px solid #ddd",
          borderRadius: "5px",
        }}
      >
        {/* Header Row */}
        <div className="d-flex justify-content-between fw-bold bg-light p-2 border-bottom">
          <span>Process Name</span>
          <span>Actions</span>
        </div>

        {loading ? (
          <div className="text-center p-3">
            <Spinner animation="border" size="sm" /> Loading processes...
          </div>
        ) : processList.length > 0 ? (
          <ListGroup variant="flush">
            {processList.map((item) => (
              <ListGroup.Item
                key={item.processId}
                className="d-flex justify-content-between align-items-center"
              >
                <span>{item.processName}</span>
                <div className="d-flex gap-2">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleEditClick(item)}
                    title="Edit Process"
                  >
                    <FaPen />
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDeleteProcess(item.processId)}
                    title="Delete Process"
                  >
                    <FaTrash />
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <div className="text-muted text-center p-3">
            No processes have been added yet.
          </div>
        )}
      </div>
    </Card>
  );
};

export default AddProcessSuggestion;
