LATESTARTSERVICE=true

ui_print "🗡--------------------------------🗡"
ui_print "      Ayunda Risu Color Enhancer    "
ui_print "🗡--------------------------------🗡"
ui_print "         By: Kanagawa Yamada        "
ui_print "------------------------------------"
ui_print "      READ THE TELEGRAM MESSAGE     "
ui_print "------------------------------------"
ui_print " "
sleep 1.5

ui_print "-----------------📱-----------------"
ui_print "            DEVICE INFO             "
ui_print "-----------------📱-----------------"
ui_print "DEVICE : $(getprop ro.build.product) "
ui_print "MODEL : $(getprop ro.product.model) "
ui_print "MANUFACTURE : $(getprop ro.product.system.manufacturer) "
ui_print "PROC : $(getprop ro.product.board) "
ui_print "CPU : $(getprop ro.hardware) "
ui_print "ANDROID VER : $(getprop ro.build.version.release) "
ui_print "KERNEL : $(uname -r) "
ui_print "RAM : $(free | grep Mem |  awk '{print $2}') "
ui_print " "
sleep 1.5

ui_print "-----------------🗡-----------------"
ui_print "            MODULE INFO             "
ui_print "-----------------🗡-----------------"
ui_print "Name : Rusdi Color Enhancer"
ui_print "Version : V 2.0"
ui_print "Support Root : Magisk / KernelSU / APatch"
ui_print " "
sleep 1.5

ui_print "      DON'T BLAME ME IF YOUR        "
ui_print "         SCREEN GETS BLACK          "
ui_print " "
sleep 3

ui_print "      Installing Ayunda Risu        "
sleep 3

unzip -o "$ZIPFILE" 'AyundaRisu/*' -d $MODPATH >&2
set_perm_recursive $MODPATH/AyundaRisu 0 0 0755 0644

am start -a android.intent.action.VIEW -d https://t.me/KanagawaLabAnnouncement/304 >/dev/null 2>&1
