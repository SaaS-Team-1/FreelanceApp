const { getDataConnect, queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'FreelanceApp',
  location: 'europe-west1'
};
exports.connectorConfig = connectorConfig;

function createUserRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  if('_useGeneratedSdk' in dcInstance) {
    dcInstance._useGeneratedSdk();
  } else {
    console.error('Please update to the latest version of the Data Connect SDK by running `npm install firebase@dataconnect-preview`.');
  }
  return mutationRef(dcInstance, 'CreateUser', inputVars);
}
exports.createUserRef = createUserRef;
exports.createUser = function createUser(dcOrVars, vars) {
  return executeMutation(createUserRef(dcOrVars, vars));
};

function insertManyUsersRef(dc) {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  if('_useGeneratedSdk' in dcInstance) {
    dcInstance._useGeneratedSdk();
  } else {
    console.error('Please update to the latest version of the Data Connect SDK by running `npm install firebase@dataconnect-preview`.');
  }
  return mutationRef(dcInstance, 'InsertManyUsers');
}
exports.insertManyUsersRef = insertManyUsersRef;
exports.insertManyUsers = function insertManyUsers(dc) {
  return executeMutation(insertManyUsersRef(dc));
};

function deleteUserRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  if('_useGeneratedSdk' in dcInstance) {
    dcInstance._useGeneratedSdk();
  } else {
    console.error('Please update to the latest version of the Data Connect SDK by running `npm install firebase@dataconnect-preview`.');
  }
  return mutationRef(dcInstance, 'DeleteUser', inputVars);
}
exports.deleteUserRef = deleteUserRef;
exports.deleteUser = function deleteUser(dcOrVars, vars) {
  return executeMutation(deleteUserRef(dcOrVars, vars));
};

function createLanguageRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  if('_useGeneratedSdk' in dcInstance) {
    dcInstance._useGeneratedSdk();
  } else {
    console.error('Please update to the latest version of the Data Connect SDK by running `npm install firebase@dataconnect-preview`.');
  }
  return mutationRef(dcInstance, 'createLanguage', inputVars);
}
exports.createLanguageRef = createLanguageRef;
exports.createLanguage = function createLanguage(dcOrVars, vars) {
  return executeMutation(createLanguageRef(dcOrVars, vars));
};

function createGigRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  if('_useGeneratedSdk' in dcInstance) {
    dcInstance._useGeneratedSdk();
  } else {
    console.error('Please update to the latest version of the Data Connect SDK by running `npm install firebase@dataconnect-preview`.');
  }
  return mutationRef(dcInstance, 'CreateGig', inputVars);
}
exports.createGigRef = createGigRef;
exports.createGig = function createGig(dcOrVars, vars) {
  return executeMutation(createGigRef(dcOrVars, vars));
};

function deleteGigRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  if('_useGeneratedSdk' in dcInstance) {
    dcInstance._useGeneratedSdk();
  } else {
    console.error('Please update to the latest version of the Data Connect SDK by running `npm install firebase@dataconnect-preview`.');
  }
  return mutationRef(dcInstance, 'DeleteGig', inputVars);
}
exports.deleteGigRef = deleteGigRef;
exports.deleteGig = function deleteGig(dcOrVars, vars) {
  return executeMutation(deleteGigRef(dcOrVars, vars));
};

function createTransactionRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  if('_useGeneratedSdk' in dcInstance) {
    dcInstance._useGeneratedSdk();
  } else {
    console.error('Please update to the latest version of the Data Connect SDK by running `npm install firebase@dataconnect-preview`.');
  }
  return mutationRef(dcInstance, 'createTransaction', inputVars);
}
exports.createTransactionRef = createTransactionRef;
exports.createTransaction = function createTransaction(dcOrVars, vars) {
  return executeMutation(createTransactionRef(dcOrVars, vars));
};

function deleteTransactionRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  if('_useGeneratedSdk' in dcInstance) {
    dcInstance._useGeneratedSdk();
  } else {
    console.error('Please update to the latest version of the Data Connect SDK by running `npm install firebase@dataconnect-preview`.');
  }
  return mutationRef(dcInstance, 'DeleteTransaction', inputVars);
}
exports.deleteTransactionRef = deleteTransactionRef;
exports.deleteTransaction = function deleteTransaction(dcOrVars, vars) {
  return executeMutation(deleteTransactionRef(dcOrVars, vars));
};

function createMessageRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  if('_useGeneratedSdk' in dcInstance) {
    dcInstance._useGeneratedSdk();
  } else {
    console.error('Please update to the latest version of the Data Connect SDK by running `npm install firebase@dataconnect-preview`.');
  }
  return mutationRef(dcInstance, 'createMessage', inputVars);
}
exports.createMessageRef = createMessageRef;
exports.createMessage = function createMessage(dcOrVars, vars) {
  return executeMutation(createMessageRef(dcOrVars, vars));
};

function deleteMessageRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  if('_useGeneratedSdk' in dcInstance) {
    dcInstance._useGeneratedSdk();
  } else {
    console.error('Please update to the latest version of the Data Connect SDK by running `npm install firebase@dataconnect-preview`.');
  }
  return mutationRef(dcInstance, 'DeleteMessage', inputVars);
}
exports.deleteMessageRef = deleteMessageRef;
exports.deleteMessage = function deleteMessage(dcOrVars, vars) {
  return executeMutation(deleteMessageRef(dcOrVars, vars));
};

function createCategoryRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  if('_useGeneratedSdk' in dcInstance) {
    dcInstance._useGeneratedSdk();
  } else {
    console.error('Please update to the latest version of the Data Connect SDK by running `npm install firebase@dataconnect-preview`.');
  }
  return mutationRef(dcInstance, 'createCategory', inputVars);
}
exports.createCategoryRef = createCategoryRef;
exports.createCategory = function createCategory(dcOrVars, vars) {
  return executeMutation(createCategoryRef(dcOrVars, vars));
};

function deleteCategoryRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  if('_useGeneratedSdk' in dcInstance) {
    dcInstance._useGeneratedSdk();
  } else {
    console.error('Please update to the latest version of the Data Connect SDK by running `npm install firebase@dataconnect-preview`.');
  }
  return mutationRef(dcInstance, 'DeleteCategory', inputVars);
}
exports.deleteCategoryRef = deleteCategoryRef;
exports.deleteCategory = function deleteCategory(dcOrVars, vars) {
  return executeMutation(deleteCategoryRef(dcOrVars, vars));
};

function createRatingRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  if('_useGeneratedSdk' in dcInstance) {
    dcInstance._useGeneratedSdk();
  } else {
    console.error('Please update to the latest version of the Data Connect SDK by running `npm install firebase@dataconnect-preview`.');
  }
  return mutationRef(dcInstance, 'createRating', inputVars);
}
exports.createRatingRef = createRatingRef;
exports.createRating = function createRating(dcOrVars, vars) {
  return executeMutation(createRatingRef(dcOrVars, vars));
};

function deleteRatingRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  if('_useGeneratedSdk' in dcInstance) {
    dcInstance._useGeneratedSdk();
  } else {
    console.error('Please update to the latest version of the Data Connect SDK by running `npm install firebase@dataconnect-preview`.');
  }
  return mutationRef(dcInstance, 'DeleteRating', inputVars);
}
exports.deleteRatingRef = deleteRatingRef;
exports.deleteRating = function deleteRating(dcOrVars, vars) {
  return executeMutation(deleteRatingRef(dcOrVars, vars));
};

function creatingApplicatiponRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  if('_useGeneratedSdk' in dcInstance) {
    dcInstance._useGeneratedSdk();
  } else {
    console.error('Please update to the latest version of the Data Connect SDK by running `npm install firebase@dataconnect-preview`.');
  }
  return mutationRef(dcInstance, 'creatingApplicatipon', inputVars);
}
exports.creatingApplicatiponRef = creatingApplicatiponRef;
exports.creatingApplicatipon = function creatingApplicatipon(dcOrVars, vars) {
  return executeMutation(creatingApplicatiponRef(dcOrVars, vars));
};

function listUsersRef(dc) {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  if('_useGeneratedSdk' in dcInstance) {
    dcInstance._useGeneratedSdk();
  } else {
    console.error('Please update to the latest version of the Data Connect SDK by running `npm install firebase@dataconnect-preview`.');
  }
  return queryRef(dcInstance, 'ListUsers');
}
exports.listUsersRef = listUsersRef;
exports.listUsers = function listUsers(dc) {
  return executeQuery(listUsersRef(dc));
};

function listLanguagesRef(dc) {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  if('_useGeneratedSdk' in dcInstance) {
    dcInstance._useGeneratedSdk();
  } else {
    console.error('Please update to the latest version of the Data Connect SDK by running `npm install firebase@dataconnect-preview`.');
  }
  return queryRef(dcInstance, 'ListLanguages');
}
exports.listLanguagesRef = listLanguagesRef;
exports.listLanguages = function listLanguages(dc) {
  return executeQuery(listLanguagesRef(dc));
};

function listGigsRef(dc) {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  if('_useGeneratedSdk' in dcInstance) {
    dcInstance._useGeneratedSdk();
  } else {
    console.error('Please update to the latest version of the Data Connect SDK by running `npm install firebase@dataconnect-preview`.');
  }
  return queryRef(dcInstance, 'ListGigs');
}
exports.listGigsRef = listGigsRef;
exports.listGigs = function listGigs(dc) {
  return executeQuery(listGigsRef(dc));
};

