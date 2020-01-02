module.exports = function createHandleId(value) {
  var hash = 0;
  if (value.length == 0) return hash;
  for (i = 0; i < value.length; i++) {
    char = value.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};