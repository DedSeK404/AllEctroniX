// utils/componentImages.ts

export const getComponentImage = (
  type?: string,
  category?: string,
  describe?: string,
): string => {
  const query =
    `${type || ""} ${category || ""} ${describe || ""}`.toLowerCase();
  const uniformParams = "auto=format&fit=crop&w=600&h=400&q=80";

  // 1. Microcontrollers (MCU/MPU/SOC)
  if (query.includes("microcontrollers") || query.includes("mcu/mpu/soc")) {
    return `https://img.magnific.com/free-vector/circuit-board-isometric-concept_1284-15916.jpg?semt=ais_hybrid&w=740&${uniformParams}`;
  }
  // 2. Charge Pumps
  if (query.includes("charge pumps")) {
    return `https://img.magnific.com/free-vector/semiconductor-electronic-components-isometric-composition_1284-23811.jpg?semt=ais_hybrid&w=740&${uniformParams}`;
  }
  // 3. DC-DC Converters
  if (query.includes("dc-dc converters")) {
    return `https://static.vecteezy.com/system/resources/previews/020/928/996/non_2x/semiconductors-components-circuit-board-microship-design-symbols-concept-isometric-semiconductor-illustration-isometric-isolated-vector.jpg?${uniformParams}`;
  }
  // 4. MOSFETs
  if (query.includes("mosfets")) {
    return `https://img.magnific.com/free-vector/semiconductor-isometric-set-microchip-microprocessor-diode-transistor-capacitor-resistor-slot-isolated-elements_1284-32996.jpg?semt=ais_hybrid&w=740&${uniformParams}`;
  }
  // 5. Diodes - General Purpose
  if (query.includes("diodes - general purpose")) {
    return `https://t4.ftcdn.net/jpg/21/96/24/91/360_F_2196249182_yOFtIUWgKYMqIqaj7uNqR27PNAGTOoyp.jpg?${uniformParams}`;
  }
  // 6. EEPROM
  if (query.includes("eeprom")) {
    return `https://c8.alamy.com/comp/2FK27YX/electrical-boards-isometric-hardware-items-computer-power-diodes-semiconductors-and-small-chip-vector-equipment-set-2FK27YX.jpg?${uniformParams}`;
  }
  // 7. NOR FLASH
  if (query.includes("nor flash")) {
    return `https://static.vecteezy.com/system/resources/previews/002/908/324/non_2x/semiconductor-2x2-design-concept-illustration-vector.jpg?${uniformParams}`;
  }
  // 8. Digital Potentiometers
  if (query.includes("digital potentiometers")) {
    return `https://img.magnific.com/premium-vector/cartoon-semiconductor-chips-gpu-cpu-processor-microchip-motherboard-electronic-circuit-board-computer-smartphone-micro-chip-mobile-phone-neat-vector-illustration_81894-14818.jpg?${uniformParams}`;
  }
  // 9. Digital Isolators
  if (query.includes("digital isolators")) {
    return `https://plus.unsplash.com/premium_vector-1768316988698-01d3ecbe3c1f?fm=jpg&q=60&w=3000&${uniformParams}`;
  }
  // 10. RS-485 / RS-422 ICs
  if (query.includes("rs-485") || query.includes("rs-422")) {
    return `https://plus.unsplash.com/premium_vector-1768443867108-ee893d5db2c9?fm=jpg&q=60&w=3000&${uniformParams}`;
  }
  // 11. Multilayer Ceramic Capacitors MLCC - SMD/SMT
  if (
    query.includes("multilayer ceramic capacitors") ||
    query.includes("mlcc")
  ) {
    return `https://static.vecteezy.com/system/resources/thumbnails/044/414/546/small/isometric-electronic-board-isometric-printed-circuit-board-with-electronic-components-electronic-components-and-integrated-circuit-board-vector.jpg?${uniformParams}`;
  }
  // 12. Chip Resistor - Surface Mount (Replaced with a valid public Unsplash image)
  if (query.includes("chip resistor") || query.includes("surface mount") || query.includes("resistor")) {
    return `https://cdn.vectorstock.com/i/500p/19/77/isometric-circuit-board-vector-13581977.jpg?${uniformParams}`;
  }
  // 13. Power Inductors
  if (query.includes("power inductors")) {
    return `https://img.magnific.com/premium-vector/semiconductor-element-production-isometric-illustration_1284-57872.jpg?${uniformParams}`;
  }
  // 14. RF Filters
  if (query.includes("rf filters")) {
    return `https://cdn.vectorstock.com/i/500p/25/09/smartphone-semiconductor-concept-vector-50712509.jpg?${uniformParams}`;
  }
  // 15. Ferrite Beads
  if (query.includes("ferrite beads")) {
    return `https://img.magnific.com/premium-vector/semiconductor-chip-isometric-3d-composition_98292-32514.jpg?semt=ais_hybrid&w=740&${uniformParams}`;
  }
  // 16. ESD and Surge Protection (TVS/ESD)
  if (query.includes("esd and surge protection") || query.includes("tvs/esd") || query.includes("circuit protection")) {
    return `https://images.unsplash.com/photo-1563770660941-20978e870e26?${uniformParams}`;
  }
  // 17. Programmable Oscillators
  if (query.includes("programmable oscillators")) {
    return `https://static.vecteezy.com/system/resources/previews/069/760/378/non_2x/engineers-developing-semiconductor-chip-illustration-vector.jpg?${uniformParams}`;
  }
  // 18. Transistor, Photovoltaic Output Optoisolators
  if (query.includes("photovoltaic output optoisolators")) {
    return `https://cdn.vectorstock.com/i/500p/99/31/cpu-processor-icon-set-vector-63449931.jpg?${uniformParams}`;
  }
  // 19. Logic Output Optoisolators
  if (query.includes("logic output optoisolators")) {
    return `https://img.magnific.com/premium-vector/electronic-parts-electronics-circuit_41472-29.jpg?semt=ais_hybrid&w=740&${uniformParams}`;
  }
  // 20. Pre-ordered Connectors
  if (
    query.includes("pre-ordered connectors") ||
    query.includes("connectors")
  ) {
    return `https://png.pngtree.com/png-clipart/20241127/original/pngtree-vector-electronic-components-robotics-png-image_17325858.png?${uniformParams}`;
  }
  // 21. Tactile Switches
  if (query.includes("tactile switches") || query.includes("switches")) {
    return `https://images.unsplash.com/photo-1581092160607-ee22621dd758?${uniformParams}`;
  }
  // 22. Rotary Switches
  if (query.includes("rotary switches")) {
    return `https://img.magnific.com/premium-vector/modern-electronics-technology-icons-design-professionals_1322553-74497.jpg?semt=ais_hybrid&w=740&${uniformParams}`;
  }
  // 23. Slide Switches
  if (query.includes("slide switches") || query.includes("button")) {
    return `https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?${uniformParams}`;
  }

  return `/Circuit.jpg`;
};