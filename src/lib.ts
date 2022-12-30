export const convertData = (str: string) => {
  if (str.includes("netmask") && str.includes("inet")) {
    // command: ifconfig
    return str.match(/\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g);
  }

  if (str.includes("Core 0")) {
    // command: sensors
    return (
      str
        // you must change this value for your device.
        .substring(str?.indexOf("Core 0"))
        ?.match(/\d{2,}/g)
        // you must change this value for your device.
        ?.filter((v: string) => !["80", "98"].includes(v))
    );
  }

  if (str.includes("───────") && str.includes("uptime")) {
    return str
      .replace(/\n/g, "")
      .replace(/[^a-z0-9\s{0,}]/g, "")
      .split("  ")
      .filter((v) => v !== "")
      .slice(11);
  }

  return str;
};
