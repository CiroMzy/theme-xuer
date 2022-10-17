$(function () {
  $('[drawer-open-localization]').click(function() {
      theme.drawer.open($(this).data('action-type'))
  })
})