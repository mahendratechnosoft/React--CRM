import React, { useRef, useState } from "react";
import { Button, Container, Row, Col, Form, Card } from "react-bootstrap";
import { FaPlusCircle, FaTrash } from "react-icons/fa";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { toast } from "react-toastify";
import axiosInstance from "../../BaseComponet/axiosInstance";

// --- Dummy Data for Select Dropdowns ---
const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'sent', label: 'Sent' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'declined', label: 'Declined' }
];
const assignedOptions = [
  { value: 'Alice', label: 'Alice' },
  { value: 'Bob', label: 'Bob' },
  { value: 'Charlie', label: 'Charlie' }
];
const currencyOptions = [
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'INR', label: 'INR - Indian Rupee' },
  { value: 'EUR', label: 'EUR - Euro' }
];

const CreateQuotation = ({ onCancel, onSave }) => {
  // --- State for top-level form fields ---
  const [companyName, setCompanyName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [quotationNo, setQuotationNo] = useState("");
  const [supplierCode, setSupplierCode] = useState("");
  const [quotationDate, setQuotationDate] = useState(new Date().toISOString().split('T')[0]);
  const [openTill, setOpenTill] = useState("");
  const [currency, setCurrency] = useState(null);
  const [status, setStatus] = useState(null);
  const [assigned, setAssigned] = useState(null);
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState(null);
  const [state, setState] = useState(null);
  const [city, setCity] = useState(null);
  const [zip, setZip] = useState("");
  const [reference, setReference] = useState("As per your mailed enquiry & subseqvent verbal disscussion.");

  // --- State for Creatable Dropdowns ---
  const [partNameOptions, setPartNameOptions] = useState([]);
  const [loadingPartName, setLoadingPartName] = useState(false);
  const [materialOptions, setMaterialOptions] = useState([]);
  const [loadingMaterial, setLoadingMaterial] = useState(false);
  const [thicknessOptions, setThicknessOptions] = useState([]);
  const [loadingThickness, setLoadingThickness] = useState(false);

  // --- State for multiple parts and their processes ---
  const [partsData, setPartsData] = useState([
    {
      id: 1,
      partName: null,
      partNumber: '',
      material: null,
      thickness: null,
      partSize: '',
      partWeight: '',
      images: [],
      fileInputRef: React.createRef(),
      processes: [{ id: 1, toolConstruction: '', opNo: '', description: '', l: '', w: '', h: '', factor: '', rate: '', toolCost: '' }]
    }
  ]);

  const [considerations, setConsiderations] = useState([
    { id: 1, title: 'PACKAGING', descriptions: ['Included in above costing.'] },
    { id: 2, title: 'TRANSPORT', descriptions: ['Prices given are EX WORKS, PUNE.'] },
    { id: 3, title: 'TAXES', descriptions: ['Extra as applicable.'] },
    { id: 4, title: 'PAYMENTS', descriptions: ['40% advance with PO,']},
    { id: 5, title: 'DELIVERY ', descriptions: [
        'As per Schedule given below after your confirmed PO and Advance Payments.',
        '4 weeks for Design, 14-16 weeks for T0 samples after DAP, 06 weeks for T1 Samples after T0 samples Approvals.'
      ]},
    { id: 6, title: 'DESIGN ', descriptions: [
      'Input part data, tool design ( 3D & 2D ) & Input Press data with Bolster and Ram Layouts required from you.',
      'We will do a complete 3D assly tool design Catia V5 / UG-NX format for Parts Process, Die face generation and Process Simulation.',
      'Tolerance considered = Trimline ±1mm, Surface Profile ±0.5mm, General-purpose hole +0.5/-0.0  and "A" class hole +0.2/-0.0.',
      'We will submit you detailed Simulation and Feasibility Report after finalisation of order.',
      'Above Tool cost include Tool Design, Simulation, Tool Manufacturing with Material, Assembly, Tool Trials and part Quality maturation.',
    ] },
    { id: 7, title: 'STD ITEMS ', descriptions: [
      'All STD parts ( MISUMI / FIBRO ) will be as per your approved BOM.',
      'Other Equivalent standard items / Materials from another supplier will be as per your approval. ',
      '10% spare items  ( Minimum 1 no ) for standard punches, die buttons, coil springs are considered in above costing. ',
    ]},
    { id: 8, title: 'TOOL CONSTRUCTION ', descriptions: [
      'Tool constructions will be Casting Type & Plate type.',
      'Materials cutting - D2 IMP FOR DIE STEELS WITH VACCUM HARDENING UP TO 59-61 HRC. We will submit the respective test reports.',
      'PVD / Hard Chrome coating cost of D2 inserts of Forming / Draw category dies will be extra.',
      'Tool life considered is 5,00,000 strokes with proper preventive maintainance of tools. ',
      'At the time of manufacturing any modification in given input data will be on chargeable basis.',
    ]},
    { id: 9, title: 'CHECKING FIXTURES ', descriptions: [
      'Checking fixture cost included. CF construction will be MS plate with CIBA matl as per STD / Guideline.',
      'Checking fixture CMM will be carried out as per your requirements.',
    ]},
    { id: 10, title: 'SAMPLES ', descriptions: [
      'All part material for tool trials and part submission will be in your scope.',
      'Cost of parts submission for your welding trials and assly trials will be extra at actual.',
      'We will retain scrap generated during tryout.'
    ]},
    { id: 11, title: 'TOOL BUYOFF ', descriptions: [
      'Tool buy-off will be at our end, all genuine defects and deviation observed during tool buy-off will be corrected before final dispatch.',
      'Our one engineer & one die maker will visit at your works for Installations & Homeline trials of dies. ',
      'Your support will be required for production press availability & other machines or instruments availability for misc correction / repairing work. ',
    ]},
    { id: 12, title: 'QTN VALIDITY ', descriptions: [
      '30 DAYS.',
    ]}
  ]);

  // --- Handlers for Parts (Sections) and Processes (Entries) ---
  const handlePartDataChange = (partIndex, field, value) => {
    const updatedPartsData = [...partsData];
    updatedPartsData[partIndex][field] = value;
    setPartsData(updatedPartsData);
  };

  const handlePartSelectChange = (partIndex, selectedOption, actionMeta) => {
    const updatedPartsData = [...partsData];
    updatedPartsData[partIndex][actionMeta.name] = selectedOption;
    setPartsData(updatedPartsData);
  };

  const handleImageUploadClick = (partIndex) => {
    partsData[partIndex].fileInputRef.current.click();
  };

  const handleFileChange = (partIndex, e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({ file, url: URL.createObjectURL(file) }));
    const updatedPartsData = [...partsData];
    updatedPartsData[partIndex].images = [...updatedPartsData[partIndex].images, ...newImages];
    setPartsData(updatedPartsData);
  };

  const handleDeleteImage = (partIndex, imageIndex) => {
    const updatedPartsData = [...partsData];
    updatedPartsData[partIndex].images = updatedPartsData[partIndex].images.filter((_, idx) => idx !== imageIndex);
    setPartsData(updatedPartsData);
  };

  const handleProcessChange = (partIndex, processIndex, e) => {
    const { name, value } = e.target;
    const updatedPartsData = [...partsData];
    updatedPartsData[partIndex].processes[processIndex][name] = value;
    setPartsData(updatedPartsData);
  };

  const addProcess = (partIndex) => {
    const updatedPartsData = [...partsData];
    const newProcessId = updatedPartsData[partIndex].processes.length > 0 ? Math.max(...updatedPartsData[partIndex].processes.map(p => p.id)) + 1 : 1;
    updatedPartsData[partIndex].processes.push({ id: newProcessId, toolConstruction: '', opNo: '', description: '', l: '', w: '', h: '', factor: '', rate: '', toolCost: '' });
    setPartsData(updatedPartsData);
  };

  const removeProcess = (partIndex, processIndex) => {
    const updatedPartsData = [...partsData];
    if (updatedPartsData[partIndex].processes.length > 1) {
      updatedPartsData[partIndex].processes = updatedPartsData[partIndex].processes.filter((_, idx) => idx !== processIndex);
      setPartsData(updatedPartsData);
    }
  };

  const addPart = () => {
    const newPartId = partsData.length > 0 ? Math.max(...partsData.map(p => p.id)) + 1 : 1;
    setPartsData([
      ...partsData,
      {
        id: newPartId,
        partName: null,
        partNumber: '',
        material: null,
        thickness: null,
        partSize: '',
        partWeight: '',
        images: [],
        fileInputRef: React.createRef(),
        processes: [{ id: 1, toolConstruction: '', opNo: '', description: '', l: '', w: '', h: '', factor: '', rate: '', toolCost: '' }]
      }
    ]);
  };

  const removePart = (partIndex) => {
    if (partsData.length > 1) {
      setPartsData(partsData.filter((_, idx) => idx !== partIndex));
    }
  };

  const handleConsiderationChange = (consIndex, descIndex, e) => {
    const { name, value } = e.target;
    const newConsiderations = [...considerations];
    if (name === 'title') {
      newConsiderations[consIndex].title = value;
    } else if (name === 'description') {
      newConsiderations[consIndex].descriptions[descIndex] = value;
    }
    setConsiderations(newConsiderations);
  };

  // Adds a new consideration group (title + one description)
  const addConsideration = () => {
    setConsiderations([...considerations, { id: Date.now(), title: '', descriptions: [''] }]);
  };

  // Removes an entire consideration group
  const removeConsideration = (consIndex) => {
    if (considerations.length > 1) {
      setConsiderations(considerations.filter((_, i) => i !== consIndex));
    }
  };

  // Adds a new description field to an existing consideration
  const addDescription = (consIndex) => {
    const newConsiderations = [...considerations];
    newConsiderations[consIndex].descriptions.push('');
    setConsiderations(newConsiderations);
  };

  // Removes a specific description field
  const removeDescription = (consIndex, descIndex) => {
    const newConsiderations = [...considerations];
    if (newConsiderations[consIndex].descriptions.length > 1) {
      newConsiderations[consIndex].descriptions.splice(descIndex, 1);
      setConsiderations(newConsiderations);
    }
  };

  // --- API Handlers for Creatable Selects ---
  const fetchParts = async () => {
    setLoadingPartName(true);
    try {
      const res = await axiosInstance.get("/work/getAllParts");
      const options = res.data.map(p => ({ label: p.partName, value: p.partId }));
      setPartNameOptions(options);
    } catch (err) {
      toast.error("Failed to load parts");
    } finally {
      setLoadingPartName(false);
    }
  };

  const handlePartNameCreate = async (inputValue) => {
    setLoadingPartName(true);
    try {
      const res = await axiosInstance.post(`/work/addPart/${inputValue}`);
      const newOption = { label: res.data.partName, value: res.data.partId };
      setPartNameOptions(prev => [...prev, newOption]);
      toast.success(`Added "${newOption.label}"`);
    } catch (err) {
      toast.error("Failed to add part");
    } finally {
      setLoadingPartName(false);
    }
  };

  const fetchMaterials = async () => {
    setLoadingMaterial(true);
    try {
      const res = await axiosInstance.get("/work/getAllMaterials");
      const options = res.data.map(m => ({ label: m.materialName, value: m.materialId }));
      setMaterialOptions(options);
    } catch (err) {
      toast.error("Failed to load materials");
    } finally {
      setLoadingMaterial(false);
    }
  };

  const handleMaterialCreate = async (inputValue) => {
    setLoadingMaterial(true);
    try {
      const res = await axiosInstance.post(`/work/addMaterial/${inputValue}`);
      const newOption = { label: res.data.materialName, value: res.data.materialId };
      setMaterialOptions(prev => [...prev, newOption]);
      toast.success(`Added "${newOption.label}"`);
    } catch (err) {
      toast.error("Failed to add material");
    } finally {
      setLoadingMaterial(false);
    }
  };

  const fetchThicknesses = async () => {
    setLoadingThickness(true);
    try {
      const res = await axiosInstance.get("/work/getAllThicknesses");
      const options = res.data.map(t => ({ label: t.thicknessName, value: t.thicknessId }));
      setThicknessOptions(options);
    } catch (err) {
      toast.error("Failed to load thicknesses");
    } finally {
      setLoadingThickness(false);
    }
  };

  const handleThicknessCreate = async (inputValue) => {
    setLoadingThickness(true);
    try {
      const res = await axiosInstance.post(`/work/addThickness/${inputValue}`);
      const newOption = { label: res.data.thicknessName, value: res.data.thicknessId };
      setThicknessOptions(prev => [...prev, newOption]);
      toast.success(`Added "${newOption.label}"`);
    } catch (err) {
      toast.error("Failed to add thickness");
    } finally {
      setLoadingThickness(false);
    }
  };


  // --- Calculation for Final Summary ---
  const grandSubtotal = partsData.reduce((acc, part) => {
    const partSubtotal = part.processes.reduce((pAcc, process) => {
      return pAcc + (parseFloat(process.toolCost) || 0);
    }, 0);
    return acc + partSubtotal;
  }, 0);

  const cgst = grandSubtotal * 0.09;
  const sgst = grandSubtotal * 0.09;
  const total = grandSubtotal + cgst + sgst;

  // --- Payload Generation and Save Handler ---

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      // This check is important. If it's not a file/blob, it might be an already converted string.
      if (!(file instanceof Blob)) {
        resolve(file);
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.split(",")[1]; // Get only the base64 part
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });

  const handleSave = async () => {
    try {
      const quotationInfo = {
        companyName: companyName,
        contactPersonName: contactPerson,
        address: address,
        refrence: reference,
        quotationDate: quotationDate,
        validDate: openTill,
        quotationNumber: quotationNo,
        supplierCode: supplierCode,
        projectName: projectName,
        currency: currency ? currency.value : null,
        status: status ? status.value : null,
        assigned: assigned ? assigned.value : null,
        email: email,
        phone: phone,
        country: country,
        state: state,
        city: city,
        zip: zip,
      };

      const quotationParts = await Promise.all(
        partsData.map(async (part) => {
          const cleanedProcesses = part.processes.map((proc) => ({
            toolConstruction: proc.toolConstruction,
            oprationNumber: proc.opNo,
            description: proc.description,
            length: parseFloat(proc.l) || 0,
            width: parseFloat(proc.w) || 0,
            height: parseFloat(proc.h) || 0,
            factor: parseFloat(proc.factor) || 0,
            rate: parseFloat(proc.rate) || 0,
            totalCost: parseFloat(proc.toolCost) || 0,
          }));

          const partImagesWithIdArray = await Promise.all(
            part.images.map(async (image) => {
              const base64 = await fileToBase64(image.file);
              return {
                id: null,
                base64Image: base64
              };
            })
          );

          return {
            partName: part.partName ? part.partName.label : "",
            partNo: part.partNumber,
            material: part.material ? part.material.label : "",
            thickness: part.thickness ? part.thickness.label : "",
            partSize: part.partSize,
            partWeight: part.partWeight,
            partProcess: cleanedProcesses,
            partImagesWithId: partImagesWithIdArray,
          };
        })
      );

      const cleanedConsiderations = considerations.flatMap(cons =>
        cons.descriptions
          .filter(desc => desc.trim() !== '' && cons.title.trim() !== '')
          .map(desc => ({
            titel: cons.title,
            description: desc
          }))
      );

      const payload = {
        quotationInfo,
        quotationParts,
        quotationConsiderations: cleanedConsiderations,
      };

      console.log("--- SENDING JSON PAYLOAD ---", JSON.stringify(payload, null, 2));

      const response = await axiosInstance.post(
        "/sales/createQuotation",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      toast.success("Quotation saved successfully.");
      console.log("Backend Response:", response.data);
      if (onSave) onSave();

    } catch (error) {
      console.error("Error saving quotation:", error.response ? error.response.data : error.message);
      toast.error("Failed to save quotation. Please check the console for details.");
    }
  };


  return (
    <Card>
      <Card.Header className="quotation-header">
        <Card.Title>Add Quotation</Card.Title>
      </Card.Header>
      <Card.Body className="quotation-body">
        <Container fluid>
          <Row>
            {/* --- Left Partition: Customer Information --- */}
            <Col md={6} className="mb-3 mb-md-0">
              <Card>
                <Card.Header as="h5">Customer Information</Card.Header>
                <Card.Body>
                  <Row className="mb-3">
                    <Col><Form.Group><Form.Label>Company Name <span className="text-danger">*</span></Form.Label><Form.Control type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} /></Form.Group></Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md={6}><Form.Group><Form.Label>Contact Person <span className="text-danger">*</span></Form.Label><Form.Control type="text" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} /></Form.Group></Col>
                    <Col md={6}><Form.Group><Form.Label>Phone <span className="text-danger">*</span></Form.Label><Form.Control type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} /></Form.Group></Col>
                  </Row>
                  <Row className="mb-3">
                    <Col><Form.Group><Form.Label>Email <span className="text-danger">*</span></Form.Label><Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></Form.Group></Col>
                  </Row>
                  <Row className="mb-3">
                    <Col><Form.Group><Form.Label>Address <span className="text-danger">*</span></Form.Label><Form.Control as="textarea" rows={2} value={address} onChange={(e) => setAddress(e.target.value)} /></Form.Group></Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md={6}><Form.Group><Form.Label>City <span className="text-danger">*</span></Form.Label><Form.Control type="text" value={city} onChange={(e) => setCity(e.target.value)} /></Form.Group></Col>
                    <Col md={6}><Form.Group><Form.Label>State <span className="text-danger">*</span></Form.Label><Form.Control type="text" value={state} onChange={(e) => setState(e.target.value)} /></Form.Group></Col>
                  </Row>
                  <Row>
                    <Col md={6}><Form.Group><Form.Label>Country <span className="text-danger">*</span></Form.Label><Form.Control type="text" value={country} onChange={(e) => setCountry(e.target.value)} /></Form.Group></Col>
                    <Col md={6}><Form.Group><Form.Label>Zip <span className="text-danger">*</span></Form.Label><Form.Control type="text" value={zip} onChange={(e) => setZip(e.target.value)} /></Form.Group></Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            {/* --- Right Partition: Quotation Details --- */}
            <Col md={6}>
              <Card>
                <Card.Header as="h5">Quotation Details</Card.Header>
                <Card.Body>
                  <Row className="mb-3">
                    <Col><Form.Group><Form.Label>Project Name <span className="text-danger">*</span></Form.Label><Form.Control type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} /></Form.Group></Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md={6}><Form.Group><Form.Label>Quotation No <span className="text-danger">*</span></Form.Label><Form.Control type="text" value={quotationNo} onChange={(e) => setQuotationNo(e.target.value)} /></Form.Group></Col>
                    <Col md={6}><Form.Group><Form.Label>Quotation Date <span className="text-danger">*</span></Form.Label><Form.Control type="date" value={quotationDate} onChange={(e) => setQuotationDate(e.target.value)} /></Form.Group></Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md={6}><Form.Group><Form.Label>Supplier Code</Form.Label><Form.Control type="text" value={supplierCode} onChange={(e) => setSupplierCode(e.target.value)} /></Form.Group></Col>
                    <Col md={6}><Form.Group><Form.Label>Open Till</Form.Label><Form.Control type="date" value={openTill} onChange={(e) => setOpenTill(e.target.value)} /></Form.Group></Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md={6}><Form.Group><Form.Label>Status <span className="text-danger">*</span></Form.Label><Select options={statusOptions} value={status} onChange={setStatus} placeholder="Select Status" /></Form.Group></Col>
                    <Col md={6}><Form.Group><Form.Label>Assigned <span className="text-danger">*</span></Form.Label><Select options={assignedOptions} value={assigned} onChange={setAssigned} placeholder="Select Assigned" /></Form.Group></Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md={6}><Form.Group><Form.Label>Currency</Form.Label><Select options={currencyOptions} value={currency} onChange={setCurrency} placeholder="Select Currency" /></Form.Group></Col>
                  </Row>
                  <Row>
                    <Col><Form.Group><Form.Label>Reference</Form.Label><Form.Control as="textarea" rows={2} value={reference} onChange={(e) => setReference(e.target.value)} /></Form.Group></Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
        <hr />

        {/* --- Multi-Part Section Start --- */}
        {partsData.map((part, partIndex) => (
          <Card key={part.id} className="mb-4 section-card-shadow">
            <Card.Header className="d-flex justify-content-between align-items-center section-cart-header">
              <Button variant="danger" onClick={() => removePart(partIndex)} disabled={partsData.length <= 1} className="ms-auto">
                <FaTrash />
              </Button>
            </Card.Header>
            <Card.Body>
              <Container fluid>
                <Row className="mb-3 align-items-center">
                  <Col md={4}><Form.Group><Form.Label className="fw-bold">Part Number</Form.Label><Form.Control type="text" name="partNumber" value={part.partNumber} onChange={(e) => handlePartDataChange(partIndex, 'partNumber', e.target.value)} /></Form.Group></Col>
                  <Col md={4}><Form.Group><Form.Label className="fw-bold">Part Name</Form.Label><CreatableSelect name="partName" isClearable onMenuOpen={fetchParts} onChange={(s, a) => handlePartSelectChange(partIndex, s, a)} onCreateOption={handlePartNameCreate} options={partNameOptions} isLoading={loadingPartName} placeholder="Search or create..." value={part.partName} /></Form.Group></Col>
                  <Col md={4}><Form.Group><Form.Label className="fw-bold">Material</Form.Label><CreatableSelect name="material" isClearable onMenuOpen={fetchMaterials} onChange={(s, a) => handlePartSelectChange(partIndex, s, a)} onCreateOption={handleMaterialCreate} options={materialOptions} isLoading={loadingMaterial} placeholder="Search or create..." value={part.material} /></Form.Group></Col>
                </Row>

                <Row className="mb-3 align-items-center">
                  <Col md={4}><Form.Group><Form.Label className="fw-bold">Thickness</Form.Label><CreatableSelect name="thickness" isClearable onMenuOpen={fetchThicknesses} onChange={(s, a) => handlePartSelectChange(partIndex, s, a)} onCreateOption={handleThicknessCreate} options={thicknessOptions} isLoading={loadingThickness} placeholder="Search or create..." value={part.thickness} /></Form.Group></Col>
                  <Col md={4}><Form.Group><Form.Label className="fw-bold">Part Size</Form.Label><Form.Control type="text" name="partSize" value={part.partSize} onChange={(e) => handlePartDataChange(partIndex, 'partSize', e.target.value)} /></Form.Group></Col>
                  <Col md={4}><Form.Group><Form.Label className="fw-bold">Part Weight</Form.Label><Form.Control type="text" name="partWeight" value={part.partWeight} onChange={(e) => handlePartDataChange(partIndex, 'partWeight', e.target.value)} /></Form.Group></Col>
                </Row>
                <Row className="mb-3">
                  <Col>
                    <Form.Group>
                      <Form.Label className="fw-bold">Part View</Form.Label>
                      <div className="d-flex flex-wrap gap-3">
                        <div className="upload-box-qut" onClick={() => handleImageUploadClick(partIndex)}>
                          <div className="plus_symbol">+</div>
                          <p>Click to upload</p>
                        </div>
                        {part.images.map((img, imgIndex) => (
                          <div key={imgIndex} style={{ height: "120px", width: "120px", border: "1px solid #ccc", borderRadius: "8px", overflow: "hidden", position: "relative" }}>
                            <img src={img.url} alt={`Preview ${imgIndex}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            <Button variant="danger" size="sm" onClick={() => handleDeleteImage(partIndex, imgIndex)} style={{ position: 'absolute', top: '5px', right: '5px', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                              &times;
                            </Button>
                          </div>
                        ))}
                        <Form.Control type="file" ref={part.fileInputRef} onChange={(e) => handleFileChange(partIndex, e)} multiple style={{ display: "none" }} accept="image/*" />
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
              </Container>
              <Container fluid>
                <Row className="mb-2 d-none d-md-flex text-center fw-bold fs-6">
                  <Col md={2}>Tool Construction</Col>
                  <Col md={1}>OP No</Col>
                  <Col md={2}>Description</Col>
                  <Col md={1}>L</Col>
                  <Col md={1}>W</Col>
                  <Col md={1}>H</Col>
                  <Col md={1}>Factor</Col>
                  <Col md={1}>Rate</Col>
                  <Col md={1}>Tool Cost</Col>
                  <Col md={1}>Action</Col>
                </Row>

                {part.processes.map((process, processIndex) => (
                  <Card key={process.id} className="mb-1">
                    <Card.Body className="p-3">
                      <Row className="align-items-center">
                        <Col xs={6} md={2}><Form.Group><Form.Label className="d-md-none fw-bold">Tool Construction</Form.Label><Form.Control type="text" name="toolConstruction" value={process.toolConstruction} onChange={(e) => handleProcessChange(partIndex, processIndex, e)} /></Form.Group></Col>
                        <Col xs={6} md={1}><Form.Group><Form.Label className="d-md-none fw-bold">OP No</Form.Label><Form.Control type="text" name="opNo" value={process.opNo} onChange={(e) => handleProcessChange(partIndex, processIndex, e)} /></Form.Group></Col>
                        <Col xs={12} md={2}><Form.Group><Form.Label className="d-md-none fw-bold">Description</Form.Label><Form.Control as="textarea" rows={1} name="description" value={process.description} onChange={(e) => handleProcessChange(partIndex, processIndex, e)} /></Form.Group></Col>
                        <Col xs={6} md={1}><Form.Group><Form.Label className="d-md-none fw-bold">L</Form.Label><Form.Control type="number" name="l" value={process.l} onChange={(e) => handleProcessChange(partIndex, processIndex, e)} /></Form.Group></Col>
                        <Col xs={6} md={1}><Form.Group><Form.Label className="d-md-none fw-bold">W</Form.Label><Form.Control type="number" name="w" value={process.w} onChange={(e) => handleProcessChange(partIndex, processIndex, e)} /></Form.Group></Col>
                        <Col xs={6} md={1}><Form.Group><Form.Label className="d-md-none fw-bold">H</Form.Label><Form.Control type="number" name="h" value={process.h} onChange={(e) => handleProcessChange(partIndex, processIndex, e)} /></Form.Group></Col>
                        <Col xs={6} md={1}><Form.Group><Form.Label className="d-md-none fw-bold">Factor</Form.Label><Form.Control type="number" name="factor" value={process.factor} onChange={(e) => handleProcessChange(partIndex, processIndex, e)} /></Form.Group></Col>
                        <Col xs={6} md={1}><Form.Group><Form.Label className="d-md-none fw-bold">Rate</Form.Label><Form.Control type="number" name="rate" value={process.rate} onChange={(e) => handleProcessChange(partIndex, processIndex, e)} /></Form.Group></Col>
                        <Col xs={6} md={1}><Form.Group><Form.Label className="d-md-none fw-bold">Tool Cost</Form.Label><Form.Control type="number" name="toolCost" value={process.toolCost} onChange={(e) => handleProcessChange(partIndex, processIndex, e)} /></Form.Group></Col>
                        <Col className="text-center">
                          <Button variant="outline-danger" size="sm" onClick={() => removeProcess(partIndex, processIndex)} disabled={part.processes.length <= 1}>
                            <FaTrash />
                          </Button>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                ))}
                <Row className="align-items-center">
                  {/* Spacer columns to push content to the right */}
                  <Col md={9} style={{ paddingLeft: '55px' }} className="text-end">
                    <strong style={{ fontSize: '1.1rem' }}>Sub Total:</strong>
                  </Col>
                  <Col md={3}>
                    <Form.Control
                      readOnly
                      disabled
                      className="fw-bold"
                      value={
                        part.processes.reduce((total, currentProcess) => {
                          return total + (parseFloat(currentProcess.toolCost) || 0);
                        }, 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })
                      }
                    />
                  </Col>
                </Row>
                <Row>
                  <Col className="text-end mt-2">
                    <Button variant="success" size="sm" onClick={() => addProcess(partIndex)}>
                      <FaPlusCircle /> Add Process
                    </Button>
                  </Col>
                </Row>
              </Container>
            </Card.Body>
          </Card>
        ))}


        <Container fluid className="text-end">
          <Button variant="success" size="sm" onClick={addPart}>
            <FaPlusCircle /> Add Part
          </Button>
        </Container>

        <Container fluid className="mt-4">
          <Row className="justify-content-end ">
            <Col md={4}>
              <div className="p-3" style={{ border: '1px solid #dee2e6', borderRadius: '.25rem' }}>
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>
                  <span className='fw-bold'>{grandSubtotal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>CGST - 9.00%</span>
                  <span>{cgst.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>SGST - 9.00%</span>
                  <span>{sgst.toFixed(2)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold h5">
                  <span>Total</span>
                  <span>{total.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>

        <Container fluid className="mt-4">
          <Card>
            <Card.Header>
              <Card.Title as="h5">Quotation Considerations</Card.Title>
            </Card.Header>
            <Card.Body>
              {considerations.map((item, consIndex) => (
                <div key={item.id} className="mb-3 p-3" style={{ border: '1px solid #eee', borderRadius: '8px' }}>
                  <Row className="mb-2">
                    {/* Title Input */}
                    <Col>
                      <Form.Group>
                        <Form.Label className="fw-bold">Title {consIndex + 1}</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Consideration title (e.g., Payment Terms)"
                          name="title"
                          value={item.title}
                          onChange={(e) => handleConsiderationChange(consIndex, null, e)}
                        />
                      </Form.Group>
                    </Col>
                    {/* Remove Entire Consideration Button */}
                    <Col xs="auto" className="d-flex align-items-end">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removeConsideration(consIndex)}
                        disabled={considerations.length <= 1}
                      >
                        <FaTrash /> Remove Title
                      </Button>
                    </Col>
                  </Row>

                  {/* Descriptions Mapping */}
                  {item.descriptions.map((desc, descIndex) => (
                    <Row key={descIndex} className="mb-2 align-items-center">
                      <Col xs="auto" className="ps-4">
                        <span className="fw-bold">{`•`}</span>
                      </Col>
                      <Col>
                        <Form.Group>
                          <Form.Label className="d-none">Description</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={1}
                            placeholder="Description point"
                            name="description"
                            value={desc}
                            onChange={(e) => handleConsiderationChange(consIndex, descIndex, e)}
                          />
                        </Form.Group>
                      </Col>
                      <Col xs="auto" className="d-flex gap-2">
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => removeDescription(consIndex, descIndex)}
                          disabled={item.descriptions.length <= 1}
                        >
                          <FaTrash />
                        </Button>
                        {/* Show Add button only for the last description */}
                        {descIndex === item.descriptions.length - 1 && (
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => addDescription(consIndex)}
                          >
                            <FaPlusCircle />
                          </Button>
                        )}
                      </Col>
                    </Row>
                  ))}
                </div>
              ))}
              <div className="d-flex justify-content-end">
                <Button variant="success" size="sm" onClick={addConsideration}>
                  <FaPlusCircle className="me-2" /> Add Consideration
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Container>

      </Card.Body>
      <Card.Footer className="text-end quotation-footer">
        <Button variant="outline-secondary" onClick={onCancel} className="me-2">Cancel</Button>
        <Button variant="primary" onClick={handleSave}>Save Quotation</Button>
      </Card.Footer>
    </Card>
  );
};

export default CreateQuotation;