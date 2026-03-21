const getPriorityFromType = (type = "") => {
  const normalized = type.trim().toLowerCase();

  if (normalized === "flood" || normalized === "fire") {
    return "High";
  }

  if (normalized === "earthquake" || normalized === "landslide") {
    return "Medium";
  }

  return "Low";
};

module.exports = { getPriorityFromType };
