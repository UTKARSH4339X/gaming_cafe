import { stations, tierMeta } from "../data";

function seats(tier) {
  return stations.filter((station) => station.tier === tier);
}

export default function Floor({ held = [], selected, onPick, tiers, caption }) {
  const heldSet = new Set(held);
  const interactive = Boolean(onPick);

  function seat(station) {
    const locked = tiers ? !tiers.includes(station.tier) : false;
    const isHeld = heldSet.has(station.id);
    const isSelected = selected === station.id;
    const state = isSelected ? "selected" : isHeld ? "held" : locked ? "locked" : "free";
    const className = `seat ${state}${interactive ? " interactive" : ""}`;
    const label = station.id === "BOOTH" ? "BOOTH" : station.id;
    const body = (
      <>
        <small>{tierMeta[station.tier].short}</small>
        <strong>{label}</strong>
      </>
    );

    if (!interactive) {
      return (
        <div key={station.id} className={className} title={tierMeta[station.tier].name}>
          {body}
        </div>
      );
    }

    return (
      <button
        key={station.id}
        type="button"
        className={className}
        disabled={locked || isHeld}
        onClick={() => onPick(station.id)}
        title={tierMeta[station.tier].name}
      >
        {body}
      </button>
    );
  }

  return (
    <div className="floor-card" id="floor">
      <div className="floor-top">
        <div>
          <p className="kicker light">Floor</p>
          <p className="floor-caption-title">{caption}</p>
        </div>
        <ul className="legend">
          <li><i className="swatch open" /> Open</li>
          <li><i className="swatch held" /> Held</li>
          <li><i className="swatch yours" /> Yours</li>
        </ul>
      </div>
      <div className="floor-scroll">
        <div className="floor">
          <p className="floor-window">Window · Katwaria Sarai</p>
          <p className="floor-caption">Standard · A1 to A8</p>
          <div className="floor-row eight">{seats("standard").map(seat)}</div>
          <p className="floor-caption">Pro · B1 to B8</p>
          <div className="floor-row eight">{seats("pro").map(seat)}</div>
          <p className="floor-caption">Arena, couch, and the squad booth</p>
          <div className="floor-row tail">
            {seats("arena").map(seat)}
            {seats("couch").map(seat)}
            {seats("squad").map(seat)}
          </div>
          <div className="floor-foot">
            <span>Desk</span>
            <span>Headsets stay on the rig</span>
          </div>
        </div>
      </div>
    </div>
  );
}
