import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import {
  Accordion,
  Card,
  Form,
  Row,
  Col,
  Button,
  Table,
} from "react-bootstrap";
import { FaTrash, FaPlusCircle } from "react-icons/fa";
import axiosInstance from "../../../BaseComponet/axiosInstance";
import { toast } from "react-toastify";
import CreatableSelect from "react-select/creatable";

const CompanyUpdateProjectRegistrationKickoffSheet = ({
  eventKey,
  activeKey,
  CustomToggle,
  handleAccordionClick,
  initialProjectData = {},
  initialPartsData = [],
  initialProcessesData = [],
  onProjectDataChange,
  onPartsChange,
  onProcessesChange,
  id,
  selectedProjectId,
  customerId,
  customerName,
  projectId,
  projectName,
}) => {
  const [projectData, setProjectData] = useState({
    projectId: "",
    projectName: "",
    projectTitle: "",
    kickOffDate: "",
    startDate: "",
    endDate: "",
  });

  const [isEditingGlobally, setIsEditingGlobally] = useState(false);

  const [parts, setParts] = useState([]);
  const [processesByPart, setProcessesByPart] = useState({});
  const [activePartItemNo, setActivePartItemNo] = useState(null);
  const [latestItemNumber, setLatestItemNumber] = useState(0);
  const [employeeList, setEmployeeList] = useState([]);
  const [selectedProcessesByPart, setSelectedProcessesByPart] = useState({});

  const [partOptions, setPartOptions] = useState([]); // List of dropdown options
  const [loadingPart, setLoadingPart] = useState(false); // Loader for dropdown actions

  const [materialOptions, setMaterialOptions] = useState([]);
  const [loadingMaterial, setLoadingMaterial] = useState(false);

  const [thicknessOptions, setThicknessOptions] = useState([]);
  const [loadingThickness, setLoadingThickness] = useState(false);

  const [processLoading, setProcessLoading] = useState(false);
  const [processOptions, setProcessOptions] = useState([]);

  const [processesSuggestionsOptions, setProcessesSuggestionsOptions] =
    useState([]);
  const [processesSuggestionsLoading, setProcessesSuggestionsLoading] =
    useState(false);
  const [suffixOptions, setSuffixOptions] = useState([]);

  const flattenProcessesByPart = (pbp) => Object.values(pbp).flat();

  useEffect(() => {
    axiosInstance
      .get("/company/getEmployeeList/0/10")
      .then((response) => {
        setEmployeeList(response.data.employeeList || []);
      })
      .catch((err) => {
        console.error("Failed to fetch employee list:", err);
      });
  }, []);

  // =======================INITIAL DATA FETCHING (initialPartsData)  FROM PARENT======================

  useEffect(() => {
    if (!selectedProjectId) {
      if (Array.isArray(initialPartsData) && initialPartsData.length > 0) {
        setParts(
          initialPartsData.map((p, idx) => {
            let loadedImages = [];
            if (p.imageListWithId && typeof p.imageListWithId === "object") {
              loadedImages = Object.entries(p.imageListWithId).map(
                ([imageId, imagePath]) => ({
                  imageId,
                  imagePath,
                })
              );
            }

            return {
              ...p,
              id: p.itemId || Date.now() + idx,
              itemId: p.itemId,
              itemNo:
                typeof p.itemNo === "string" ? p.itemNo : `PT-${p.itemNo || 0}`,
              images: loadedImages,
              partName: p.partName || "",
              material: p.material || "",
              thickness: p.thickness || "",
              isNew: false,
              isEditing: false,
            };
          })
        );

        const grouped = {};
        initialProcessesData.forEach((proc) => {
          const itemNo =
            typeof proc.itemNo === "string"
              ? proc.itemNo
              : `PT-${proc.itemNo || 0}`;
          if (!grouped[itemNo]) grouped[itemNo] = [];
          grouped[itemNo].push({
            ...proc,
            id: proc.partProcessId || Date.now() + Math.random(),
            woNo: proc.workOrderNumber || "",
            designer: proc.employeeId || "",
            designerName: proc.designerName || "",
            opNo: proc.operationNumber || "",
            processName: proc.process || "",
            length: proc.length || "",
            width: proc.width || "",
            height: proc.height || "",
            remarks: proc.remarks || "",
            isNewForWorkOrder: false,
            isEditing: false,
            parentWorkOrderNo: proc.parentWorkOrderNo || "",
          });
        });
        setProcessesByPart(grouped);

        if (initialPartsData.length > 0) {
          setActivePartItemNo(
            typeof initialPartsData[0].itemNo === "string"
              ? initialPartsData[0].itemNo
              : `PT-${initialPartsData[0].itemNo || 0}`
          );
        }

        // compute latest number
        const numbers = initialPartsData.map((part) => {
          const match = `${part.itemNo}`.match(/PT-(\d+)/);
          return match ? parseInt(match[1], 10) : 0;
        });
        setLatestItemNumber(numbers.length ? Math.max(...numbers) : 0);
      }
      return;
    }

    // CASE 2: project changed → fetch from project API
    setParts([]);
    setProcessesByPart({});
    setActivePartItemNo(null);
    setLatestItemNumber(0);

    axiosInstance
      .get(`/work/getWorkOrderItemsByProjectId/${selectedProjectId}`)
      .then((res) => {
        console.log("**********selected project data--", res.data);
        if (res.data) {
          populatePartsAndProcesses(res.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching part/process data:", err);
      });

    fetchMaxItemNumber(); // optional per project
  }, [selectedProjectId, initialPartsData, initialProcessesData]);

  // Update selectedProcessesByPart when processOptions or processesByPart changes
  useEffect(() => {
    if (!processOptions || Object.keys(processesByPart).length === 0) return;
    setSelectedProcessesByPart((prev) => {
      // Rebuild the mapping for each active part
      const updated = {};
      Object.entries(processesByPart).forEach(([itemNo, processes]) => {
        // Only processes with opNo '0' are to be shown as selected
        updated[itemNo] = processes
          .filter((p) => p.opNo === "0")
          .map((p) => {
            const suffix = p.woNo.replace(itemNo, "");
            const matchedOption = processOptions.find(
              (opt) => opt.value === suffix
            );
            return matchedOption
              ? matchedOption
              : { value: suffix, label: suffix || "Archived" };
          });
      });
      return updated;
    });
  }, [processOptions, processesByPart]);

  // Function to populate Parts & Processes from API data
  const populatePartsAndProcesses = (data) => {
    const { partProcess, partDetails } = data;

    const groupedByItem = {};
    partProcess.forEach((item) => {
      const key = `PT-${item.itemNo}`;
      if (!groupedByItem[key]) groupedByItem[key] = [];
      groupedByItem[key].push(item);
    });

    const newParts = [];
    const newProcessesByPart = {};
    const newSelectedByPart = {};

    partDetails.forEach((partDetail, index) => {
      const itemNo = `PT-${partDetail.itemNo}`;
      let loadedImages = [];
      if (
        partDetail.imageListWithId &&
        typeof partDetail.imageListWithId === "object"
      ) {
        loadedImages = Object.entries(partDetail.imageListWithId).map(
          ([imageId, imagePath]) => ({
            imageId,
            imagePath,
          })
        );
      }
      const part = {
        id: partDetail.partId || Date.now() + index,
        itemId: partDetail.partId,
        itemNo,
        partName: partDetail.partName || "",
        material: partDetail.material || "",
        thickness: partDetail.thickness || "",
        images: loadedImages,
        isNew: false,
      };

      newParts.push(part);

      const processes = (groupedByItem[itemNo] || []).map((proc, idx) => ({
        id: proc.partProcessId || Date.now() + index * 10 + idx,
        partProcessId: proc.partProcessId,
        woNo: proc.workOrderNo || "",
        cancel: proc.cancel,
        scope: proc.scope,
        itemNo,
        designer: proc.employeeId || "",
        designerName: proc.designerName || "",
        opNo: proc.operationNumber?.toString() || "",
        processName: (proc.proceess || proc.process || "").trim().toLowerCase(),

        length: proc.length || "",
        width: proc.width || "",
        height: proc.height || "",
        remarks: proc.remark || proc.remarks || "",
        isEditing: false,
        parentWorkOrderNo: proc.parentWorkOrderNo || "",
        isFromPartProcess: proc.operationNumber === 0,
      }));
      console.log("process@@@@@@@@@@@ in Update", processes);
      // newProcessesByPart[itemNo] = processes;
      // newProcessesByPart[itemNo] = reNumberProcesses(processes, itemNo);

      const selectedForPart = processes
        .filter((p) => p.opNo === "0")
        .map((p) => {
          // Extract suffix from woNo
          const suffix = p.woNo.replace(itemNo, "");

          // Find if dropdown options has this suffix
          const matchedOption = processOptions.find(
            (opt) => opt.value === suffix
          );

          // Return actual dropdown option if found, else fallback to archived
          return matchedOption
            ? matchedOption
            : { value: suffix, label: suffix || "Archived" };
        });

      newSelectedByPart[itemNo] = selectedForPart;
      newProcessesByPart[itemNo] = processes;
    });

    // For dropdown, select process with opNo '0' and map to existing options or mark as archived

    setParts(newParts);
    setProcessesByPart(newProcessesByPart);
    setSelectedProcessesByPart(newSelectedByPart);

    if (newParts.length > 0) {
      setActivePartItemNo(newParts[0].itemNo);
    }

    // Set latest item number
    // const numbers = newParts.map((p) => {
    //   const match = `${p.itemNo}`.match(/PT-(\d+)/);
    //   return match ? parseInt(match[1], 10) : 0;
    // });
    // setLatestItemNumber(numbers.length ? Math.max(...numbers) : 0);
  };

  // ================================Dropdown =============================
  const handlePartsCreateOption = async (inputValue, partId) => {
    setLoadingPart(true);
    try {
      const res = await axiosInstance.post(`/work/addPart/${inputValue}`);
      const newOption = {
        label: res.data.partName,
        value: res.data.partId,
      };
      setPartOptions((prev) => [...prev, newOption]);
      // Immediately update the partName of the relevant part so dropdown shows selected
      updatePart(partId, "partName", newOption.label);
      toast.success(`Added "${newOption.label}"`);
    } catch (err) {
      toast.error("Failed to add part");
    } finally {
      setLoadingPart(false);
    }
  };

  const fetchParts = async () => {
    try {
      setLoadingPart(true);

      const res = await axiosInstance.get("/work/getAllParts");
      const options = res.data.map((p) => ({
        label: p.partName,
        value: p.partId,
      }));
      setPartOptions(options);
    } catch (err) {
      toast.error("Failed to load parts");
    } finally {
      setLoadingPart(false);
    }
  };

  const handlePartsSelect = (selectedOption, actionMeta, partId) => {
    if (selectedOption) {
      // If an option is selected, set both id and display label
      updatePart(partId, "partName", selectedOption.label);
      // Optionally, store the partId (backend id) in your part object as well, if needed:
      // updatePart(partId, "partMasterId", selectedOption.value);
    } else {
      // Cleared selection
      updatePart(partId, "partName", "");
      // updatePart(partId, "partMasterId", null);
    }
  };

  // helpers
  function ensureValueInOptions(options, value) {
    if (!value) return options;
    const exists = options.some(
      (option) => option.label === value || option.value === value
    );
    return exists ? options : [...options, { label: value, value }];
  }

  const fetchMaterial = async () => {
    try {
      setLoadingMaterial(true);
      const res = await axiosInstance.get("/work/getAllMaterials");
      const options = res.data.map((p) => ({
        label: p.materialName,
        value: p.materialId,
      }));
      setMaterialOptions(options);
    } catch (err) {
      toast.error("Failed to load materials");
    } finally {
      setLoadingMaterial(false);
    }
  };

  const handleMaterialCreateOption = async (inputValue, partId) => {
    setLoadingMaterial(true);
    try {
      const res = await axiosInstance.post(`/work/addMaterial/${inputValue}`);
      const newOption = {
        label: res.data.materialName,
        value: res.data.materialId,
      };
      setMaterialOptions((prev) => [...prev, newOption]);
      updatePart(partId, "material", newOption.label); // Select the newly created option immediately
      toast.success(`Added "${newOption.label}"`);
    } catch (err) {
      toast.error("Failed to add material");
    } finally {
      setLoadingMaterial(false);
    }
  };

  const handleMaterialSelect = (selectedOption, actionMeta, partId) => {
    if (selectedOption) {
      updatePart(partId, "material", selectedOption.label);
    } else {
      updatePart(partId, "material", "");
    }
  };

  function ensureValueInOptions(options, value) {
    if (!value) return options;
    const exists = options.some(
      (option) => option.label === value || option.value === value
    );
    return exists ? options : [...options, { label: value, value }];
  }

  const fetchThickness = async () => {
    try {
      setLoadingThickness(true);
      const res = await axiosInstance.get("/work/getAllThicknesses");
      const options = res.data.map((p) => ({
        label: p.thicknessName,
        value: p.thicknessId,
      }));
      setThicknessOptions(options);
    } catch (err) {
      toast.error("Failed to load thicknesses");
    } finally {
      setLoadingThickness(false);
    }
  };

  const handleThicknessCreateOption = async (inputValue, partId) => {
    setLoadingThickness(true);
    try {
      const res = await axiosInstance.post(`/work/addThickness/${inputValue}`);
      const newOption = {
        label: res.data.thicknessName,
        value: res.data.thicknessId,
      };
      setThicknessOptions((prev) => [...prev, newOption]);
      updatePart(partId, "thickness", newOption.label); // Select new thickness immediately
      toast.success(`Added "${newOption.label}"`);
    } catch (err) {
      toast.error("Failed to add thickness");
    } finally {
      setLoadingThickness(false);
    }
  };

  const handleThicknessSelect = (selectedOption, actionMeta, partId) => {
    if (selectedOption) {
      updatePart(partId, "thickness", selectedOption.label);
    } else {
      updatePart(partId, "thickness", "");
    }
  };

  useEffect(() => {
    const fetchProcessesSuggestions = async () => {
      setProcessesSuggestionsLoading(true);
      try {
        const res = await axiosInstance.get("/work/getAllProcesses");
        const data = res.data;
        const options = data.map((process) => ({
          value: process.processName.trim().toLowerCase(),
          label: process.processName,
        }));
        setProcessesSuggestionsOptions(options);
      } catch (error) {
        toast.error("Failed to load processes");
        console.error(error);
      } finally {
        setProcessesSuggestionsLoading(false);
      }
    };

    fetchProcessesSuggestions();
  }, []);
  // ===========================DROPDOWN END=================================

  // Set active part if null
  // =========================
  useEffect(() => {
    if (!activePartItemNo && parts.length > 0) {
      setActivePartItemNo(parts[0].itemNo);
    }
  }, [parts, activePartItemNo]);

  // =========================
  // Functions used in render
  // =========================
  const updatePart = (id, field, value) => {
    setParts((prev) =>
      prev.map((part) => (part.id === id ? { ...part, [field]: value } : part))
    );
  };

  // ===================REMOVE PART ============================

  const removePart = (id) => {
    if (id) {
      try {
        const responce = axiosInstance.delete(`/kickoff/deleteItem/${id}`);

        toast.success("Part Deleted successfully");
      } catch (error) {
        console.error("Failed to delete part ", error.response || error);
        toast.error("Failed to delete part");
      }
    }
    setParts((prev) => prev.filter((part) => part.id !== id));
    const part = parts.find((p) => p.id === id);
    if (part && processesByPart[part.itemNo]) {
      setProcessesByPart((prev) => {
        const copy = { ...prev };
        delete copy[part.itemNo];
        return copy;
      });
    }
    if (activePartItemNo === part?.itemNo) {
      const remaining = parts.filter((p) => p.id !== id);
      setActivePartItemNo(remaining.length ? remaining[0].itemNo : null);
    }
  };

  // ===================ADD PART ============================

  const addPart = () => {
    const existingNumbers = parts.map((part) => {
      const match =
        typeof part.itemNo === "string" && part.itemNo.match(/PT-(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    });
    const maxExisting = Math.max(latestItemNumber, ...existingNumbers);
    const nextNumber = maxExisting + 1;
    const newItemNo = `PT-${nextNumber}`;
    const newPart = {
      id: Date.now(),
      itemNo: newItemNo,
      partName: "",
      material: "",
      thickness: "",
      images: [],
      isNew: true,
      isEditing: true,
    };
    setParts((prev) => [...prev, newPart]);
    setActivePartItemNo(newItemNo);
    setProcessesByPart((prev) => ({ ...prev, [newItemNo]: [] }));
    setLatestItemNumber(nextNumber);
  };

  const updateProcess = (id, field, value) => {
    setProcessesByPart((prev) => ({
      ...prev,
      [activePartItemNo]: prev[activePartItemNo].map((proc) =>
        proc.id === id ? { ...proc, [field]: value } : proc
      ),
    }));
  };

  // ===================REMOVE PROCESS============================

  const removeProcess = (id) => {
    if (id) {
      try {
        axiosInstance.delete(`/kickoff/deleteItemProcess/${id}`);
        toast.success("Process Deleted successfully");
      } catch (error) {
        toast.error("Error while deleting process");
      }
    }

    setProcessesByPart((prev) => {
      const filtered = (prev[activePartItemNo] || []).filter(
        (proc) => proc.id !== id
      );
      // Always use the enhanced renumber logic:
      return {
        ...prev,
        [activePartItemNo]: reNumberProcesses(filtered, activePartItemNo),
      };
    });
  };

  // ===================Workorder Process DROPDOWN CODE ============================

  const getSuffix = (woNo) => woNo?.replace(activePartItemNo, "") || "";
  // const suffixOptions = ["UL", "CF", "LF", "TL"];
  const isManualProcess = (suffix) =>
    /^[A-Z]$/.test(suffix) && !suffixOptions.includes(suffix);

  const partProcesses = processesByPart[activePartItemNo] || [];

  const sortedProcesses = partProcesses || [];

  console.log("Sorted PRocess ***********", sortedProcesses);

  const handleCustomProcessChange = (newSelected) => {
    if (!activePartItemNo) return;
    const activePart = parts.find((p) => p.itemNo === activePartItemNo);
    if (!activePart) return;
    const prevSelected = selectedProcessesByPart[activePartItemNo] || [];
    const prevValues = prevSelected.map((p) => p.value);
    const newValues = newSelected?.map((p) => p.value) || [];
    const added = newValues.filter((val) => !prevValues.includes(val));
    const removed = prevValues.filter((val) => !newValues.includes(val));

    const newProcesses = added.map((suffix) => ({
      id: Date.now() + Math.random(),
      woNo: `${activePartItemNo}${suffix}`,
      itemNo: activePartItemNo,
      designer: "",
      opNo: "0",
      processName: "",
      length: "",
      width: "",
      height: "",
      remarks: "",

      isFromPartProcess: "0",
    }));

    setProcessesByPart((prev) => {
      let updatedList = prev[activePartItemNo] || [];
      updatedList = [...updatedList, ...newProcesses];
      updatedList = updatedList.filter((proc) => {
        const suffix = proc.woNo.replace(activePartItemNo, "");
        return !removed.includes(suffix);
      });
      return { ...prev, [activePartItemNo]: updatedList };
    });

    setSelectedProcessesByPart((prev) => ({
      ...prev,
      [activePartItemNo]: newSelected || [],
    }));
  };

  const fetchProcesses = async () => {
    setProcessLoading(true);
    try {
      const res = await axiosInstance.get("/work/getAllWorkOrderProcesses");
      const data = res.data;

      // build process name options as before
      const option = data.map((process) => ({
        value: process.processName,
        label: process.processName,
      }));
      setProcessOptions(option);

      // build suffix options from processSuffix (or whatever key your API provides)
      const dynamicSuffixes = Array.from(
        new Set(data.map((proc) => proc.suffix).filter(Boolean))
      );
      setSuffixOptions(dynamicSuffixes);
    } catch (error) {
      toast.error("Failed to load processes");
      console.error(error);
    } finally {
      setProcessLoading(false);
    }
  };

  // ===================ADD PROCESS AND CHILD PROCESS============================

  const addProcess = () => {
    const activePart = parts.find((p) => p.itemNo === activePartItemNo);
    if (!activePart) return;

    const existingProcesses = processesByPart[activePartItemNo] || [];
    const manualParents = existingProcesses.filter(
      (p) =>
        isManualProcess(getSuffix(p.woNo)) &&
        !p.parentWorkOrderNo &&
        !p.isFromPartProcess &&
        p.woNo !== "XX"
    );
    const manualSuffixes = manualParents.map((p) => getSuffix(p.woNo));
    const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const usedSet = new Set(manualSuffixes);
    const nextSuffix = allLetters.find((letter) => !usedSet.has(letter)) || "Z";

    const woNo = `${activePartItemNo}${nextSuffix}`;

    const newProc = {
      id: Date.now(),
      woNo,
      itemNo: activePartItemNo,
      designer: "",
      opNo: "",
      processName: "",
      length: "",
      width: "",
      height: "",
      remarks: "",
      // isNewForWorkOrder: activePart.isNew,
      isEditing: true,
    };

    // Find index of last manual parent process
    let insertIdx = -1;
    if (manualParents.length > 0) {
      const lastManualParent = manualParents[manualParents.length - 1];
      insertIdx = existingProcesses.findIndex(
        (p) => p.id === lastManualParent.id
      );
    }

    // Insert after last manual parent (or at start if none)
    const updatedProcesses = [...existingProcesses];
    if (insertIdx === -1) {
      updatedProcesses.unshift(newProc);
    } else {
      updatedProcesses.splice(insertIdx + 1, 0, newProc);
    }

    // setProcessesByPart((prev) => {
    //   const updated = [...(prev[activePartItemNo] || []), newProc];
    //   return {
    //     ...prev,
    //     [activePartItemNo]: reNumberProcesses(updated, activePartItemNo),
    //   };
    // });

    setProcessesByPart((prev) => ({
      ...prev,
      [activePartItemNo]: updatedProcesses,
    }));
  };

  // ✅ Convert only File/Blob to base64 string, pass strings as-is
  const filesToBase64 = (files) =>
    Promise.all(
      files.map((file) => {
        if (
          typeof file === "object" &&
          file.imagePath &&
          !(file instanceof File)
        ) {
          return file.imagePath;
        }
        if (typeof file === "string" && file.startsWith("data:")) {
          return file.split(",")[1];
        }
        if (file instanceof File || file instanceof Blob) {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result.split(",")[1]);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        }
        return null;
      })
    ).then((results) => results.filter(Boolean));

const addChildProcess = (parentWoNo) => {
  setProcessesByPart((prev) => {
    const processes = prev[activePartItemNo] || [];

    // Determine existing children for suffix
    const children = processes.filter(
      (p) => p.parentWorkOrderNo === parentWoNo
    );
    const numbers = children
      .map((c) => c.woNo.replace(parentWoNo, ""))
      .filter((s) => /^\d+$/.test(s))
      .map(Number);

    const nextChildNum = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;

    const newProcess = {
      id: Date.now(),
      woNo: `${parentWoNo}${nextChildNum}`,
      itemNo: activePartItemNo,
      parentWorkOrderNo: parentWoNo,
      designer: "",
      opNo: "",
      processName: "",
      length: "",
      width: "",
      height: "",
      remarks: "",
      isNewForWorkOrder: true,
      isEditing: true,
    };

    // Find the parent index
    const parentIndex = processes.findIndex((p) => p.woNo === parentWoNo);

    // Find the last child of this parent (or insert after parent if none)
    // Scan forward starting from parentIndex+1 for children with matching parentWorkOrderNo
    let insertIndex = parentIndex + 1;
    while (
      insertIndex < processes.length &&
      processes[insertIndex].parentWorkOrderNo === parentWoNo
    ) {
      insertIndex++;
    }

    // Insert new child at the right position
    const updated = [...processes];
    updated.splice(insertIndex, 0, newProcess);

    return {
      ...prev,
      [activePartItemNo]: updated,
    };
  });
};




  // ================RENAME CODE======================
  // Utility: reassigns WO NOs for parents A,B,C... and their children A1,A2...
  function reNumberProcesses(processes, activePartItemNo) {
    if (!Array.isArray(processes)) return [];

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    // 1. Orphan children
    const orphanChildren = processes.filter(
      (p) => p.woNo === "XX" && !p.parentWorkOrderNo
    );

    // 2. Manual processes (exclude dropdown + orphans)
    const manualProcesses = processes.filter(
      (p) => !p.isFromPartProcess && !(p.woNo === "XX" && !p.parentWorkOrderNo)
    );

    // 3. Dropdown processes (unchanged)
    const dropdownProcesses = processes.filter((p) => p.isFromPartProcess);

    // 4. Manual parents only
    const manualParents = manualProcesses.filter((p) => !p.parentWorkOrderNo);

    let renamedProcesses = [];

    manualParents.forEach((parent, i) => {
      const letter = letters[i]; // assign A, B, C...
      const newParentWoNo = `${activePartItemNo}${letter}`;

      // Children remap
      const children = manualProcesses
        .filter((c) => c.parentWorkOrderNo === parent.woNo)
        .sort((a, b) => {
          const anum = parseInt(a.woNo.replace(parent.woNo, ""), 10) || 0;
          const bnum = parseInt(b.woNo.replace(parent.woNo, ""), 10) || 0;
          return anum - bnum;
        });

      const renamedChildren = children.map((child, idx) => ({
        ...child,
        parentWorkOrderNo: newParentWoNo,
        woNo: `${newParentWoNo}${idx + 1}`,
      }));

      renamedProcesses.push({
        ...parent,
        woNo: newParentWoNo,
      });

      renamedProcesses = renamedProcesses.concat(renamedChildren);
    });

    // Final set = renamed + orphans + dropdown
    return [...renamedProcesses, ...orphanChildren, ...dropdownProcesses];
  }

  // =====================SAVE DATA CODE===========================
  const handleSaveOrUpdatePart = async (partToSave) => {
    // Filter only new images (File objects) before base64 encoding
    const newImageFiles = partToSave.images.filter(
      (img) => img instanceof File
    );

    // Convert only new images to base64 (or whatever filesToBase64 does)
    const imageListForKickoff = await filesToBase64(newImageFiles);
    if (partToSave.isNew || !partToSave.itemId) {
      try {
        const workOrderPayload = {
          itemNo: parseInt(partToSave.itemNo.replace(/^PT-/, ""), 10),
          partName: partToSave.partName,
          material: partToSave.material,
          thickness: partToSave.thickness,
          projectId: projectId,
          projectName: projectName,
          customerId: customerId,
          customerName: customerName,
        };

        const formData = new FormData();
        formData.append("workOrder", JSON.stringify(workOrderPayload));

        // Append only new image files from File objects
        if (newImageFiles.length > 0) {
          newImageFiles.forEach((file) => {
            formData.append("images", file);
          });
        }

        const workOrderResponse = await axiosInstance.post(
          "/work/createWorkOrderPart",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        const savedWorkOrder = workOrderResponse.data;
        const newPartId = savedWorkOrder.workOrderId;
        const kickoffItemPayload = {
          kickOffId: id,
          itemId: null,
          itemNo: parseInt(partToSave.itemNo.replace(/^PT-/, ""), 10),
          partName: partToSave.partName,
          material: partToSave.material,
          thickness: partToSave.thickness,
          imageList: imageListForKickoff,
        };

        await axiosInstance.put("/kickoff/updateItem", kickoffItemPayload);
        setParts((prevParts) =>
          prevParts.map((p) =>
            p.id === partToSave.id
              ? {
                  ...p,
                  id: newPartId,
                  woId: newPartId,
                  itemId: newPartId,
                  isNew: true,
                }
              : p
          )
        );
        toast.success("Part saved successfully!");
      } catch (error) {
        console.error("Failed to save new part:", error.response || error);

        toast.error(
          "Could not save the new part. Please check the data and try again."
        );
      }
    } else {
      try {
        const kickoffUpdatePayload = {
          itemId: partToSave.itemId,
          kickOffId: id,
          itemNo: parseInt(partToSave.itemNo.replace(/^PT-/, ""), 10),
          partName: partToSave.partName,
          material: partToSave.material,
          thickness: partToSave.thickness,
          imageList: imageListForKickoff,
        };

        console.log(
          "Updating existing part with payload:",
          kickoffUpdatePayload
        );
        await axiosInstance.put("/kickoff/updateItem", kickoffUpdatePayload);

        toast.success("Part updated successfully!");
      } catch (error) {
        console.error("Failed to update part:", error.response || error);
        toast.success("Failed to update part.");
      }
    }
  };

  const handleUpdateProcesses = async () => {
    try {
      const partsWithNewProcesses = parts.filter((part) =>
        (processesByPart[part.itemNo] || []).some(
          (proc) => proc.isNewForWorkOrder
        )
      );

      const workOrderPromises = partsWithNewProcesses.map((part) => {
        const newProcesses = (processesByPart[part.itemNo] || []).filter(
          (proc) => proc.isNewForWorkOrder
        );

        console.log("new processes", newProcesses);
        if (newProcesses.length > 0) {
          const workOrderItemsPayload = newProcesses.map((proc) => ({
            workOrderNo: proc.woNo,
            employeeId: proc.designer || null,
            operationNumber: proc.opNo,
            proceess: proc.processName,
            length: parseFloat(proc.length) || 0,
            width: parseFloat(proc.width) || 0,
            height: parseFloat(proc.height) || 0,
            remark: proc.remarks || "",
          }));
          console.log("workOrderId::::::::::::::::::", part.itemId);
          console.log(
            "workOrderItems:::::::::::::::::",
            JSON.stringify(workOrderItemsPayload)
          );

          const processFormData = new FormData();
          processFormData.append("workOrderId", part.itemId); // Use the saved workOrderId
          processFormData.append(
            "workOrderItems",
            JSON.stringify(workOrderItemsPayload)
          );

          return axiosInstance.post(
            "/work/createWorkOrderItems",
            processFormData
          );
        }
        return Promise.resolve(); // Return a resolved promise if no new processes
      });

      await Promise.all(workOrderPromises);
      if (partsWithNewProcesses.length > 0) {
        toast.success("New processes saved to work order successfully.");

        // Update state to mark processes as no longer new
        setProcessesByPart((prev) => {
          const newState = { ...prev };
          partsWithNewProcesses.forEach((part) => {
            newState[part.itemNo] = newState[part.itemNo].map((proc) => ({
              ...proc,
              isNewForWorkOrder: false,
            }));
          });
          return newState;
        });
      }
    } catch (error) {
      console.error(
        "Failed to save new processes to work order:",
        error.response || error
      );
      toast.error("Failed to save new processes to work order.");
      return;
    }

    try {
      const allProcessesForKickoff = Object.values(processesByPart)
        .flat()
        .map((proc) => {
          const itemNo =
            typeof proc.itemNo === "string"
              ? parseInt(proc.itemNo.replace(/^PT-/, ""), 10)
              : proc.itemNo;

          return {
            partProcessId: proc.partProcessId || null,
            kickOffId: id,
            itemNo,
            workOrderNumber: proc.woNo || "",
            designerName: proc.designer
              ? employeeList.find((e) => e.employeeId === proc.designer)
                  ?.name || ""
              : "",
            employeeId: proc.designer || null, // Ensure null instead of ""
            operationNumber: proc.opNo?.toString() || "",
            process: proc.processName || proc.process || "",
            length: proc.length ? parseFloat(proc.length) : null,
            width: proc.width ? parseFloat(proc.width) : null,
            height: proc.height ? parseFloat(proc.height) : null,
            remarks: proc.remarks || "",
            parentWorkOrderNo: proc.parentWorkOrderNo || null,
            cancel: proc.cancel || false,
            scope: proc.scope || false,
            sequence: proc.sequence || 0,
          };
        });

      console.log(
        "kick off itemsssssssssssssssssssssss",
        allProcessesForKickoff
      );
      if (allProcessesForKickoff.length > 0) {
        await axiosInstance.put(
          "/kickoff/updateKickOffItemsProccess",
          allProcessesForKickoff
        );
        toast.success("All processes updated in Kickoff Sheet successfully!");
      }
    } catch (error) {
      console.error(
        "Failed to update kickoff processes:",
        error.response || error
      );
      toast.error("Failed to update kickoff processes");
    }
  };

  const handleSaveAll = async () => {
    try {
      // First save/update all parts
      for (const part of parts) {
        await handleSaveOrUpdatePart(part);
      }

      // Then save/update their processes
      await handleUpdateProcesses();

      toast.success("All Parts & Processes saved successfully!");
      setIsEditingGlobally(false);
    } catch (error) {
      console.error("Save all failed:", error);
      toast.error("Failed to save parts or processes. Check console.");
    }

    setProcessesByPart((prev) => {
      const newState = {};
      for (const [itemNo, processList] of Object.entries(prev)) {
        newState[itemNo] = processList.map((p) => ({
          ...p,
          isEditing: false,
        }));
      }
      return newState;
    });
  };

  const fetchMaxItemNumber = async () => {
    try {
      console.log("Fetching max item number...");
      const response = await axiosInstance.get("/work/getMaxItemNumber");

      console.log("API response:", response.data);

      if (response.data) {
        const numericPart = parseInt(
          response.data.toString().replace(/\D/g, ""),
          10
        );
        console.log("Parsed max number is == ", numericPart);
        setLatestItemNumber(numericPart); // Correct setter
      }
    } catch (error) {
      console.error("Failed to fetch max item number:", error);
    }
  };

  // Fetch max item number once on initial mount
  useEffect(() => {
    fetchMaxItemNumber();
  }, []);

  return (
    <Card className="mb-3 shadow-sm border-0">
      <CustomToggle
        eventKey={eventKey}
        activeKey={activeKey}
        handleAccordionClick={() => handleAccordionClick(eventKey)}
      >
        Project Registration/Enquiry
      </CustomToggle>

      <Accordion.Collapse eventKey={eventKey}>
        <Card.Body>
          {/* Part Details */}

          <div className="d-flex justify-content-end mb-3">
            <Button
              variant={isEditingGlobally ? "btn btn-success" : "btn btn-dark"}
              onClick={() => {
                if (isEditingGlobally) {
                  handleSaveAll();
                } else {
                  setIsEditingGlobally(true);
                }
              }}
            >
              {isEditingGlobally ? "Update Part & Process" : "Edit"}
            </Button>
          </div>

          <h5
            className="mb-3"
            style={{ borderLeft: "4px solid #1a3c8c", paddingLeft: "12px" }}
          >
            Part Details
          </h5>

          <Table bordered responsive className="mb-0">
            <thead
              className="text-white"
              style={{ backgroundColor: "#002855" }}
            >
              <tr>
                <th>Item No.</th>
                <th>Part Name</th>
                <th>Material</th>
                <th>Thickness</th>
                <th>Image</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {parts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">
                    No parts added yet. Click "Add Part" to get started.
                  </td>
                </tr>
              ) : (
                parts.map((part) => (
                  <tr key={part.id || part.partId}>
                    <td>
                      <strong>{part.itemNo}</strong>
                    </td>
                    <td>
                      <CreatableSelect
                        styles={{
                          container: (base) => ({ ...base, width: "100%" }),
                        }}
                        menuPosition="fixed"
                        isClearable
                        onMenuOpen={fetchParts}
                        onChange={(selectedOption, actionMeta) =>
                          handlePartsSelect(selectedOption, actionMeta, part.id)
                        }
                        onCreateOption={(inputValue) =>
                          handlePartsCreateOption(inputValue, part.id)
                        }
                        options={ensureValueInOptions(
                          partOptions,
                          part.partName
                        )}
                        isLoading={loadingPart}
                        placeholder="Search or create part..."
                        value={
                          part.partName
                            ? partOptions.find(
                                (option) =>
                                  option.label === part.partName ||
                                  option.value === part.partName
                              ) || {
                                label: part.partName,
                                value: part.partName,
                              }
                            : null
                        }
                        isDisabled={!isEditingGlobally}
                      />
                    </td>
                    <td>
                      <CreatableSelect
                        styles={{
                          container: (base) => ({ ...base, width: "100%" }),
                        }}
                        menuPosition="fixed"
                        isClearable
                        onMenuOpen={fetchMaterial}
                        onChange={(selectedOption, actionMeta) =>
                          handleMaterialSelect(
                            selectedOption,
                            actionMeta,
                            part.id
                          )
                        }
                        onCreateOption={(inputValue) =>
                          handleMaterialCreateOption(inputValue, part.id)
                        }
                        options={ensureValueInOptions(
                          materialOptions,
                          part.material
                        )}
                        isLoading={loadingMaterial}
                        placeholder="Search or create material..."
                        value={
                          part.material
                            ? materialOptions.find(
                                (option) => option.label === part.material
                              ) || {
                                label: part.material,
                                value: part.material,
                              }
                            : null
                        }
                        isDisabled={!isEditingGlobally}
                      />
                    </td>
                    <td>
                      <CreatableSelect
                        styles={{
                          container: (base) => ({ ...base, width: "100%" }),
                        }}
                        menuPosition="fixed"
                        isClearable
                        onMenuOpen={fetchThickness}
                        onChange={(selectedOption, actionMeta) =>
                          handleThicknessSelect(
                            selectedOption,
                            actionMeta,
                            part.id
                          )
                        }
                        onCreateOption={(inputValue) =>
                          handleThicknessCreateOption(inputValue, part.id)
                        }
                        options={ensureValueInOptions(
                          thicknessOptions,
                          part.thickness
                        )}
                        isLoading={loadingThickness}
                        placeholder="Search or create thickness..."
                        value={
                          part.thickness
                            ? thicknessOptions.find(
                                (option) => option.label === part.thickness
                              ) || {
                                label: part.thickness,
                                value: part.thickness,
                              }
                            : null
                        }
                        isDisabled={!isEditingGlobally}
                      />
                    </td>
                    <td>
                      <div
                        style={{
                          pointerEvents: isEditingGlobally ? "auto" : "none",
                          opacity: isEditingGlobally ? 1 : 0.5,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          {/* ======================= CHANGED SECTION START ======================= */}
                          {part.images.map((img, idx) => {
                            // Determine the image source whether it's a new File or an existing image object
                            let imgSrc = "";
                            if (img instanceof File) {
                              imgSrc = URL.createObjectURL(img); // For newly added images
                            } else if (img && img.imagePath) {
                              // For existing images from the backend
                              const path = img.imagePath;
                              imgSrc = path.startsWith("data:")
                                ? path
                                : `data:image/jpeg;base64,${path}`;
                            }

                            return (
                              <div
                                key={img.imageId || idx} // Use imageId as key if available
                                style={{
                                  position: "relative",
                                  width: "100px",
                                  height: "100px",
                                  border: "1px solid #ddd",
                                  borderRadius: "4px",
                                }}
                              >
                                <img
                                  src={imgSrc}
                                  alt={`img-${idx}`}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={async () => {
                                    // This is now an async function to handle the API call
                                    try {
                                      const imageToDelete = part.images[idx];

                                      // If image has an ID, it's from the DB. Delete it via API.
                                      if (
                                        imageToDelete &&
                                        imageToDelete.imageId
                                      ) {
                                        await axiosInstance.delete(
                                          `/kickoff/deleteItemImage/${imageToDelete.imageId}`
                                        );
                                        console.log(
                                          `Image ${imageToDelete.imageId} deleted from DB`
                                        );
                                        toast.success(
                                          "Image deleted succesfully"
                                        );
                                      }

                                      // After successful API deletion (or if it's a new file), remove from local state
                                      const updatedImages = [...part.images];
                                      updatedImages.splice(idx, 1);
                                      updatePart(
                                        part.id,
                                        "images",
                                        updatedImages
                                      );
                                    } catch (err) {
                                      console.error(
                                        "Failed to delete image:",
                                        err
                                      );

                                      toast.error(
                                        "Failed to delete image from server"
                                      );
                                    }
                                  }}
                                  style={{
                                    position: "absolute",
                                    top: "-8px",
                                    right: "-8px",
                                    background: "red",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "50%",
                                    width: "24px",
                                    height: "24px",
                                    cursor: "pointer",
                                    fontSize: "14px",
                                  }}
                                >
                                  ×
                                </button>
                              </div>
                            );
                          })}
                          {/* Add More Images */}
                          <div
                            className="d-flex align-items-center justify-content-center"
                            style={{
                              border: "2px dashed #ccc",
                              padding: "12px",
                              cursor: "pointer",
                              borderRadius: "6px",
                              textAlign: "center",
                              minWidth: "100px",
                              height: "100px",
                              flexDirection: "column",
                              backgroundColor: "#f9f9f9",
                            }}
                            onClick={() =>
                              document
                                .getElementById(`multi-image-upload-${part.id}`)
                                .click()
                            }
                          >
                            <div className="text-center text-muted">
                              <i className="bi bi-plus-circle fs-4" />
                              <div
                                style={{ fontSize: "12px", marginTop: "4px" }}
                              >
                                Add More Images
                              </div>
                            </div>
                          </div>
                          <input
                            type="file"
                            id={`multi-image-upload-${part.id}`}
                            accept="image/*"
                            multiple
                            style={{ display: "none" }}
                            onChange={(e) => {
                              const selectedFiles = Array.from(e.target.files);

                              // Filter to allow only files <= 1 MB
                              const validFiles = selectedFiles.filter(
                                (file) => {
                                  if (file.size > 1024 * 1024) {
                                    // 1MB

                                    toast.error(
                                      ` "${file.name}" is larger than 1 MB and will be skipped.`
                                    );
                                    return false;
                                  }
                                  return true;
                                }
                              );

                              if (validFiles.length > 0) {
                                updatePart(part.id, "images", [
                                  ...part.images,
                                  ...validFiles,
                                ]);
                              }

                              // Reset file input so the same file can be re-selected
                              e.target.value = "";
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="text-center ">
                      {/* Delete always allowed */}

                      {/* Toggle between Edit and Save */}
                      <div className="d-flex justify-content-center">
                        {/* {part.isEditing ? (
                          <Button
                            variant="d-block btn btn-outline-success btn-sm"
                            className="d-block"
                            onClick={() => {
                              handleSaveOrUpdatePart(part);
                              updatePart(part.id, "isEditing", false);
                            }}
                          >
                            Save
                          </Button>
                        ) : (
                          <Button
                            variant="d-block btn btn-outline-dark btn-sm "
                            className="d-block"
                            onClick={() =>
                              updatePart(part.id, "isEditing", true)
                            }
                          >
                            Edit
                          </Button>
                        )} */}
                      </div>
                      <Button
                        onClick={() => removePart(part.id)}
                        variant="btn btn-outline-danger btn-sm mt-2"
                        disabled={!isEditingGlobally}
                      >
                        delete
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>

          <div className="d-flex justify-content-end mt-3 gap-2  mb-5">
            <Button
              onClick={addPart}
              variant="btn btn-outline-primary btn-sm"
              disabled={!isEditingGlobally}
            >
              <FaPlusCircle className="me-2 ms-2" /> Add Part
            </Button>
          </div>

          {/* Part Process */}
          <h5
            className="mb-3"
            style={{ borderLeft: "4px solid #1a3c8c", paddingLeft: "12px" }}
          >
            Part Process
          </h5>

          {parts.length > 0 && (
            <div>
              <div className="d-flex mb-2">
                {parts.map((part) => (
                  <div
                    key={part.itemNo}
                    className={`px-3 py-2 me-2 ${
                      activePartItemNo === part.itemNo
                        ? "bg-primary text-white"
                        : "bg-light"
                    }`}
                    style={{ borderRadius: "4px", cursor: "pointer" }}
                    onClick={() => setActivePartItemNo(part.itemNo)}
                  >
                    {part.itemNo}
                  </div>
                ))}
              </div>
              {/* Processes Table */}
              <Table bordered responsive>
                <thead style={{ backgroundColor: "#002855", color: "white" }}>
                  <tr>
                    <th>WO NO</th>
                    <th>Designer</th>
                    <th>OP NO</th>
                    <th>Process</th>
                    <th>Length</th>
                    <th>Width</th>
                    <th>Height</th>
                    <th>Remarks</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedProcesses.length > 0 ? (
                    sortedProcesses.map((proc) => (
                      <tr
                        key={proc.id}
                        style={{
                          backgroundColor: proc.cancel
                            ? "#ff8e8e"
                            : proc.scope
                            ? "#ffff86"
                            : proc.parentWorkOrderNo
                            ? "#72e190"
                            : "transparent",
                        }}
                      >
                        <td className="KickoffPrtProcessInpt-TD">
                          <Form.Control
                            value={proc.woNo}
                            onChange={(e) =>
                              updateProcess(proc.id, "woNo", e.target.value)
                            }
                            className="KickoffPrtProcessInpt"
                            disabled
                          />
                        </td>
                        <td className="KickoffPrtProcessInpt-TD">
                          <Form.Select
                            value={proc.designer || ""}
                            onChange={(e) =>
                              updateProcess(proc.id, "designer", e.target.value)
                            }
                            className="KickoffPrtProcessInpt"
                            disabled={!isEditingGlobally}
                          >
                            <option value="">Select Designer</option>
                            {employeeList.map((emp) => (
                              <option
                                key={emp.employeeId}
                                value={emp.employeeId}
                              >
                                {emp.name}
                              </option>
                            ))}
                          </Form.Select>
                        </td>
                        <td className="KickoffPrtProcessInpt-TD">
                          <Form.Select
                            value={
                              proc.opNo === "0"
                                ? "XX"
                                : proc.opNo === "-1"
                                ? ""
                                : proc.opNo
                            }
                            onChange={(e) =>
                              updateProcess(proc.id, "opNo", e.target.value)
                            }
                            className="KickoffPrtProcessInpt"
                            // disabled={proc.opNo === "0"} // ✅ fixed
                            disabled={!isEditingGlobally || proc.opNo === "0"}
                          >
                            <option value="">Select</option>
                            {[
                              "5",
                              "10",
                              "20",
                              "30",
                              "40",
                              "50",
                              "60",
                              "70",
                              "80",
                              "90",
                              "100",
                              "110",
                              "120",
                              "130",
                              "140",
                              "150",
                              "160",
                              "170",
                              "180",
                              "190",
                              "200",
                            ].map((val) => (
                              <option key={val} value={val}>
                                {val}
                              </option>
                            ))}
                            <option value="XX" disabled>
                              XX
                            </option>
                          </Form.Select>
                        </td>

                        <td className="KickoffPrtProcessInpt-TD">
                          {proc.isFromPartProcess == 0 || proc.opNo == "0" ? (
                            <Select
                              options={processesSuggestionsOptions}
                              isLoading={processesSuggestionsLoading}
                              value={
                                processesSuggestionsOptions.find(
                                  (option) => option.value === proc.processName
                                ) || null
                              }
                              onChange={(selectedOption) =>
                                updateProcess(
                                  proc.id,
                                  "processName",
                                  selectedOption ? selectedOption.value : ""
                                )
                              }
                              placeholder="Select Process..."
                              isClearable={true}
                              menuPosition="fixed"
                              disabled={!isEditingGlobally}
                              styles={{
                                control: (base) => ({
                                  ...base,
                                  minHeight: "31px",
                                  height: "31px",
                                }),
                                indicatorsContainer: (base) => ({
                                  ...base,
                                  height: "31px",
                                }),
                                valueContainer: (base) => ({
                                  ...base,
                                  top: "-2px",
                                }),
                                singleValue: (base) => ({
                                  ...base,
                                  top: "-2px",
                                }),
                              }}
                            />
                          ) : (
                            <Form.Control
                              value={proc.processName}
                              onChange={(e) =>
                                updateProcess(
                                  proc.id,
                                  "processName",
                                  e.target.value
                                )
                              }
                              className="KickoffPrtProcessInpt"
                              disabled={!isEditingGlobally}
                            />
                          )}
                        </td>

                        <td className="KickoffPrtProcessInpt-TD">
                          <Form.Control
                            value={proc.length}
                            onChange={(e) =>
                              updateProcess(proc.id, "length", e.target.value)
                            }
                            className="KickoffPrtProcessInpt"
                            disabled={!isEditingGlobally}
                          />
                        </td>
                        <td className="KickoffPrtProcessInpt-TD">
                          <Form.Control
                            value={proc.width}
                            onChange={(e) =>
                              updateProcess(proc.id, "width", e.target.value)
                            }
                            className="KickoffPrtProcessInpt"
                            disabled={!isEditingGlobally}
                          />
                        </td>
                        <td className="KickoffPrtProcessInpt-TD">
                          <Form.Control
                            value={proc.height}
                            onChange={(e) =>
                              updateProcess(proc.id, "height", e.target.value)
                            }
                            className="KickoffPrtProcessInpt"
                            disabled={!isEditingGlobally}
                          />
                        </td>
                        <td className="KickoffPrtProcessInpt-TD">
                          <Form.Control
                            value={proc.remarks}
                            onChange={(e) =>
                              updateProcess(proc.id, "remarks", e.target.value)
                            }
                            className="KickoffPrtProcessInpt"
                            disabled={!isEditingGlobally}
                          />
                        </td>

                        <td className="text-center KickoffPrtProcessInpt-TD">
                          <div className="d-flex flex-column align-items-center">
                            {/* ➕ Show only for parent rows */}
                            {!proc.parentWorkOrderNo &&
                              proc.isFromPartProcess !== "0" &&
                              proc.opNo !== "0" &&
                              proc.woNo !== "XX" && (
                                <Button
                                  variant="link"
                                  onClick={() => addChildProcess(proc.woNo)}
                                  className="text-success me-2"
                                  disabled={!isEditingGlobally}
                                >
                                  <FaPlusCircle /> {proc.opNO}
                                </Button>
                              )}

                            {/* Toggle between Save/Edit */}

                            {/* Delete always enabled unless editing */}
                            <Button
                              variant="btn btn-outline-danger btn-sm"
                              onClick={() => removeProcess(proc.id)}
                              disabled={!isEditingGlobally}
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center text-muted py-4">
                        No processes for this part yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
              {/* Multi-select for Workorder Process */}

              {activePartItemNo && (
                <div className="d-flex align-items-center justify-content-between gap-2 mb-3">
                  <strong className="me-2">Workorder Process</strong>
                  <Select
                    isMulti
                    isClearable
                    onMenuOpen={fetchProcesses}
                    options={processOptions}
                    value={selectedProcessesByPart[activePartItemNo] || []}
                    onChange={(newSelected) =>
                      handleCustomProcessChange(newSelected)
                    }
                    placeholder="Select from list..."
                    className="flex-grow-1"
                    styles={{
                      container: (base) => ({ ...base, width: "300px" }),
                    }}
                    isDisabled={!isEditingGlobally}
                  />
                  <Button
                    onClick={addProcess}
                    disabled={!isEditingGlobally}
                    variant="btn btn-outline-primary btn-sm "
                  >
                    <FaPlusCircle className="me-2" /> Add Another Process
                  </Button>
                </div>
              )}
            </div>
          )}
        </Card.Body>
      </Accordion.Collapse>
    </Card>
  );
};

export default CompanyUpdateProjectRegistrationKickoffSheet;
