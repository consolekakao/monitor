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
    // comand: pm2 status
    const pm2Data = str
      .replace(/\n/g, "")
      .replace(/[^a-z0-9\s{0,}]/g, "")
      .split("  ")
      .filter((v: string) => v !== "")
      .map((v: string) => v.replace(/\s{0,}/g, ""));

    let s = [[...pm2Data.slice(0, 11)], [...pm2Data.slice(12)]];
    let arr = {};
    for (let i = 0; i < 11; i++) {
      arr = { ...arr, [s[0][i]]: s[1][i] };
    }
    return arr;
  }

  if (str.includes("/dev/mapper/ubuntu--vg-lv--0")) {
    // command: df | sort -s
    const [total, used, available] = str
      .split(" ")
      .filter((v) => v !== "")
      .slice(1, 4);
    return {
      total,
      used,
      available,
    };
  }

  if (str.includes("Mem") && str.includes("Swap")) {
    // command: free -m
    const [total, used, available] = str
      .split(" ")
      .filter((v) => v !== "")
      .splice(6, 3);
    return {
      total,
      used,
      available,
    };
  }

  return str;
};
