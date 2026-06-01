export const LAYOUT_CSS = `
.rbc-learn { display: grid; grid-template-columns: 1fr; gap: 1.25rem; }
@media (min-width: 760px) {
  .rbc-learn { grid-template-columns: 240px minmax(0, 1fr); }
}
.rbc-cheats {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}
`;
