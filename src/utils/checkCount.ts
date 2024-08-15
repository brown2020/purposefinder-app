import {
  collection,
  getCountFromServer,
  query,
  Timestamp,
  where,
} from "firebase/firestore";

import { db } from "../firebase/firebaseConfig";

export const checkCount = async (uid: string) => {
  const c = collection(db, "profiles", uid, "covers");
  const prior = new Date(Date.now() - 30 * 1440 * 60000);
  const d = Timestamp.fromDate(prior);
  const q = query(c, where("timestamp", ">", d));
  const all = (await getCountFromServer(c)).data().count;
  const recent = (await getCountFromServer(q)).data().count;
  return { all, recent };
};
