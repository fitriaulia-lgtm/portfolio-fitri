const stems = [
  { left: '15%', top: '48%', width: '25%', angle: '-48deg' },
  { left: '29%', top: '44%', width: '22%', angle: '34deg' },
  { left: '44%', top: '38%', width: '25%', angle: '-48deg' },
  { left: '59%', top: '32%', width: '22%', angle: '38deg' },
  { left: '74%', top: '27%', width: '21%', angle: '-42deg' },
  { left: '85%', top: '23%', width: '15%', angle: '38deg' },
];

const flowers = [
  [12, 39, 36, -1.8, -8], [18, 30, 30, -1.2, 12], [23, 35, 40, -0.8, 2],
  [28, 25, 34, -0.3, -12], [34, 32, 28, 0.2, 8], [38, 21, 42, 0.8, -4],
  [44, 27, 31, 1.1, 14], [49, 16, 38, 1.5, -10], [54, 23, 44, 1.9, 5],
  [60, 14, 32, 2.3, -5], [64, 26, 38, 2.7, 10], [70, 18, 30, 3.1, -12],
  [76, 10, 42, 3.5, 3], [81, 20, 33, 3.9, -6], [87, 13, 39, 4.3, 12],
  [92, 22, 29, 4.7, -3],
];

function RoseFlower({ delay, angle }) {
  return (
    <span
      className="branch-rose-bloom"
      style={{ '--bloom-delay': `${delay}s`, '--flower-angle': `${angle}deg` }}
    >
      <span className="branch-rose-flower">
        {Array.from({ length: 12 }, (_, index) => (
          <span
            className={`branch-rose-petal branch-rose-petal-${index < 7 ? 'outer' : 'inner'}`}
            key={index}
            style={{ '--petal-angle': `${index < 7 ? index * 51.4 : (index - 7) * 72 + 18}deg` }}
          />
        ))}
        <span className="branch-rose-core" />
      </span>
    </span>
  );
}

export default function BloomingRoseBranch() {
  return (
    <div className="blooming-rose-scene absolute inset-0 z-[2] overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="blooming-rose-branch">
        <span className="rose-branch-trunk" />
        {stems.map((stem) => (
          <span
            className="rose-branch-stem"
            key={`${stem.left}-${stem.top}`}
            style={{ left: stem.left, top: stem.top, width: stem.width, '--stem-angle': stem.angle }}
          />
        ))}
        {flowers.map(([left, top, size, delay, angle]) => (
          <span
            className="branch-rose-position"
            key={`${left}-${top}`}
            style={{
              left: `${left}%`,
              top: `${top}%`,
              '--flower-size-desktop': `${size * 2.2}px`,
              '--flower-size-mobile': `${size * 1.9}px`,
            }}
          >
            <RoseFlower delay={delay} angle={angle} />
          </span>
        ))}
      </div>
    </div>
  );
}