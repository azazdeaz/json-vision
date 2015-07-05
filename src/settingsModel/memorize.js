export default function memorize(model) {
  return {
    match: model.getMatcher(),
    merge: model.getMerger(),
  }
}
