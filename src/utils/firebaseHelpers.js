import { onValue, ref } from "firebase/database";

export function subscribePath(db, path, onData) {
  const sensorRef = ref(db, path);
  const unsubscribe = onValue(sensorRef, (snap) => {
    onData(snap.val());
  });

  return unsubscribe;
}
