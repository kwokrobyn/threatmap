let activeThreats = [];

exports.list = () => {
  return activeThreats;
}

// Create threat
exports.create = (threat) => {
  activeThreats.push(threat);
  return threat;
}

// Get threat
exports.get = (id) => {
    const threats = activeThreats.filter((threat) => {
        return threat.id == id;
    });
    return threats[0];
}

// Update threat
exports.update = (newThreat) => {
  activeThreats.forEach((threat, index) => {
        if (newThreat.id == threat.id) {
            activeThreats[index] = newThreat;
        }
    });
    return newThreat;
}

// Delete threat
exports.delete = (id) => {
    let deleted = false;
    store.forEach((threat, index) => {
        if (threat.id == id) {
            activeThreats.splice(index, 1);
            deleted = true;
        }
    });

    return deleted;
}
