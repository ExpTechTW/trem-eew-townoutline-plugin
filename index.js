class Plugin {
  static instance = null;
  #ctx;
  constructor(ctx) {
    if (Plugin.instance) return Plugin.instance;
    this.#ctx = ctx;
    this.logger = null;
    this.getconfig = () => void 0;
    Plugin.instance = this;
  }

  static getInstance() {
    if (!Plugin.instance) throw new Error("Plugin not initialized");
    return Plugin.instance;
  }

  onLoad() {
    const { TREM, logger} = this.#ctx;
    this.logger = logger;
    const event = (event, callback) => TREM.variable.events.on(event, callback);
    event("MapLoad", (map) => {
      const IntensityTownOutline = () => {
        if (map.getLayer("town-outline")) map.removeLayer("town-outline");
        setTimeout(() => {
          if (map.getLayer("town-outline")) return;
          map.addLayer({
            id: "town-outline",
            type: "line",
            source: "map",
            "source-layer": "town",
            layout: { visibility: "visible" },
            paint: { "line-color": TREM.constant.COLOR.MAP.TW_COUNTY_OUTLINE },
          }, beforeLayer);
        }, 7500);
      };

      const CoverLayers = ['rts-layer', 'report-markers'];
      let beforeLayer;
      for (let i = CoverLayers.length - 1; i >= 0; i--) {
        if (map.getLayer(CoverLayers[i])) {
          beforeLayer = CoverLayers[i];
          break;
        }
      }

      event("EewRelease", (ans) => {
        const author = ans.data.author;
        if (author != 'cwa' && author != 'trem') return;
        if (map.getLayer("town-outline")) return;
        map.addLayer({
          id: "town-outline",
          type: "line",
          source: "map",
          "source-layer": "town",
          layout: { visibility: "visible" },
          paint: { "line-color": TREM.constant.COLOR.MAP.TW_COUNTY_OUTLINE },
        }, beforeLayer);
      });

      event("EewEnd", () => {
        if (map.getLayer("town-outline")) map.removeLayer("town-outline");
      });

      event("IntensityRelease", IntensityTownOutline);
      event("IntensityUpdate", IntensityTownOutline);
    });
  }
}

module.exports = Plugin;