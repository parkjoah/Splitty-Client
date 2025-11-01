import { apiFetch } from ".";
import { HistoryApiParams, HistoryListResponse } from "../../types/history";

export const getMyInfo = async () => {
  const res = await apiFetch(`/member/me`);
  return res.data;
};

export const postLocation = async ({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) => {
  await apiFetch(`/member/me/neighborhood`, {
    method: "POST",
    body: JSON.stringify({
      latitude,
      longitude,
    }),
  });
};

export const getUserInfo = async (memberId: number) => {
  const res = await apiFetch(`/member/${memberId}`);
  return res.data;
};

const buildHistoryString = (params: HistoryApiParams) => {
  const queryParams = new URLSearchParams();
  if (params.status) queryParams.set("status", params.status);
  if (params.lastId) queryParams.set("cursorId", String(params.lastId));
  if (params.lastCreatedAt)
    queryParams.set("cursorCreatedAt", params.lastCreatedAt);
  return queryParams.toString();
};

export const getMySalesList = async (
  params: HistoryApiParams
): Promise<HistoryListResponse> => {
  const queryString = buildHistoryString(params);
  const res = await apiFetch(
    `/member/me/sales${queryString ? `?${queryString}` : ""}`
  );
  return {
    items: res.data.data,
    hasNext: res.data.hasNext,
    nextCursor: res.data.nextCursor,
  };
};

export const getMyPurchasesList = async (
  params: HistoryApiParams
): Promise<HistoryListResponse> => {
  const queryString = buildHistoryString(params);
  const res = await apiFetch(
    `/member/me/purchases${queryString ? `?${queryString}` : ""}`
  );
  return {
    items: res.data.data,
    hasNext: res.data.hasNext,
    nextCursor: res.data.nextCursor,
  };
};

export const getMemberSalesList = async ({
  pageParam,
}: {
  pageParam?: {
    lastId: number | null;
    memberId: number;
    lastCreatedAt: string | null;
  };
}) => {
  const queryParams = new URLSearchParams();

  if (pageParam?.lastId) queryParams.set("cursorId", String(pageParam.lastId));
  if (pageParam?.lastCreatedAt)
    queryParams.set("cursorCreatedAt", pageParam.lastCreatedAt);
  queryParams.set("status", "OPEN");
  const url = `/member/${pageParam?.memberId}/sales?${queryParams.toString()}`;
  const res = await apiFetch(url);

  return {
    items: res.data.data,
    hasNext: res.data.hasNext,
    nextCursor: res.data.nextCursor,
  };
};
