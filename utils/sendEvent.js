export default function sendEvent({ action, category, label, value }) {
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  });
}
