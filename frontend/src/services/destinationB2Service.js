/**
 * Destination B2 API Service.
 * Follows AGENTS.md:
 * - Rule 4: File strictly under 500 lines.
 * - Dedicated endpoints for Destination B2.
 */

export const fetchB2Units = async () => {
  const response = await fetch("/api/destination-b2/units");
  if (!response.ok) {
    throw new Error(`Failed to fetch Destination B2 units: ${response.statusText}`);
  }
  return response.json();
};

export const fetchB2UnitDetail = async (unitIdentifier) => {
  const response = await fetch(`/api/destination-b2/units/${unitIdentifier}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch Unit ${unitIdentifier}: ${response.statusText}`);
  }
  return response.json();
};

export const fetchB2Exercise = async (exerciseId, includeAnswers = false) => {
  const url = `/api/destination-b2/exercises/${exerciseId}${includeAnswers ? "?include_answers=true" : ""}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch exercise: ${response.statusText}`);
  }
  return response.json();
};

export const submitB2Exercise = async (exerciseId, answers, token = null) => {
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`/api/destination-b2/exercises/${exerciseId}/submit`, {
    method: "POST",
    headers,
    body: JSON.stringify({ answers }),
  });

  if (!response.ok) {
    throw new Error(`Failed to submit exercise: ${response.statusText}`);
  }
  return response.json();
};

export const fetchB2UserProgress = async (token = null) => {
  const headers = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch("/api/destination-b2/progress", { headers });
  if (!response.ok) {
    throw new Error(`Failed to fetch progress: ${response.statusText}`);
  }
  return response.json();
};
