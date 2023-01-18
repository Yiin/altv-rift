export const vClickOutside = {
  mounted: function(el: any, binding: any) {
    el.clickOutsideEvent = function (event: any) {
      if (!(el == event.target || el.contains(event.target))) {
        binding.value(event, el)
      }
    }
    document.addEventListener("mousedown", el.clickOutsideEvent, true)
  },
  unmounted: function(el: any) {
    document.removeEventListener("mousedown", el.clickOutsideEvent)
  },
}
