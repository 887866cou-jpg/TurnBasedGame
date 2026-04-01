//alert("elements")
const DOC=document;
//buttons
const NEWGAMEBUTTON=DOC.getElementById("start_button");
const SETTINGSBUTTON=DOC.getElementById("settings_button");
const CLOSESETTINGSBUTTON=DOC.getElementById("close_settings_button");
const CHANGEPASSKEY=DOC.getElementById("change_pass_turn_key");
const STARTINGWEAPONSELECTBUTTON=DOC.getElementById("starting_weapon_select_button");
const OPTIONSBUTTON=DOC.getElementById("options_button");
const CLOSEOPTIONSMENUBUTTON=DOC.getElementById("close_options_menu_button");
const DIFFICULTYBUTTON=DOC.getElementById("difficulty_select");
const CLOSEDIFFICULTYBUTTON=DOC.getElementById("close_difficulty");
const OPENACHIEVEMENTS=DOC.getElementById("open_achievements_menu");
const CLOSEACHIEVEMENTS=DOC.getElementById("close_achievements");
const ENABLEALLDIFFICULTIES=DOC.getElementById("enable_all")
const INVENTORYBUTTON=DOC.getElementById("inventory_button")
const EXITINVENTORYBUTTON=DOC.getElementById("exit_inventory_button")
const PAUSEBUTTON=DOC.getElementById("pause_button");
const STATSBUTTON=DOC.getElementById("stats_button");
const CLOSESTATSDIALOG=DOC.getElementById("close_stats_dialog")
//dialogs
const MENUDIALOG=DOC.getElementById("menu_screen");
const FIGHTDIALOG=DOC.getElementById("fight_dialog");
const PATHDIALOG=DOC.getElementById("path_dialog");
const EQUIPDIALOG=DOC.getElementById("equip_dialog");
const EVENTDIALOG=DOC.getElementById("event_dialog");
const SETTINGSMENU=DOC.getElementById("settings_menu");
const SKILLDIALOG=DOC.getElementById("skill_dialog");
const OPTIONSDIALOG=DOC.getElementById("options_menu");
const SELECTSTARTINGWEAPONDIALOG=DOC.getElementById("select_starting_weapon_dialog");
const DIFFICULTYSELECT=DOC.getElementById("difficulty_dialog");
const PAUSEMENU=DOC.getElementById("pause_menu");
const ACHIEVEMENTSMENU=DOC.getElementById("achievements_menu");
const INVENTORYMENU=DOC.getElementById("inventory_menu");
const STATSDIALOG=DOC.getElementById("stats_dialog");


//other
const CHARACTERSTATS=DOC.getElementsByClassName("stats");
const CHARACTERABILITIES=DOC.getElementsByClassName("abilities");
const ENEMYSELECT=DOC.getElementById("enemy_select");
const ENEMYSTATS=DOC.getElementsByClassName("Estats");
const PASSBUTTON=DOC.getElementById("pass");
const TURNORDER=DOC.getElementById("turn_order_area");
const HARDPATH=DOC.getElementById("hard_path");
const EASYPATH=DOC.getElementById("easy_path");
const CHARACTERTARGETDIALOG=DOC.getElementById("character_target");
const CONSOLE=DOC.getElementById("console");
const KEYSPRESSED=DOC.getElementById("keys_pressed");
const CONSOLEINPUT=DOC.getElementById("console_input");
const CONSOLEALERTTEXT=DOC.getElementById("console_alert_text");
const CONSOLEOUTPUT=DOC.getElementById("console_output");
const CLOSEPAUSEMENU=DOC.getElementById("close_pause_menu");
const REPUTATION=DOC.getElementById("reputation");
const ACHIEVEMENTSLIST=DOC.getElementById("achievements_list");
const ACHIEVEMENTSMETER=DOC.getElementById("achievement_meter");
const ACHIEVEMENTSMETERLABEL=DOC.getElementById("achievement_meter_label");
const DIFFICULTYMETER=DOC.getElementById("difficulty_meter");
const LEVEL=DOC.getElementById("level");
const INVENTORY=DOC.getElementById("inventory")
const SEED=DOC.getElementById("seed");
const STATS=DOC.getElementById("stats");
const MOSTRECENTACHIEVEMENT=DOC.getElementById("most_recent_achievement");
//settings
const FONTSELECT=DOC.getElementById("select_font");
//difficulties
const DIFFICULTY_CHECKS=DOC.getElementsByClassName("difficulties");
const DIFFICULTY_DOUBLESCALING=DOC.getElementById("double_scaling");
const DIFFICULTY_FASTERSCALING=DOC.getElementById("faster_scaling");
const DIFFICULTY_SLOWLEVELING=DOC.getElementById("slower_leveling");
const DIFFICULTY_WEAKNESS=DOC.getElementById("weakness");
const DIFFICULTY_SWARMS=DOC.getElementById("swarms");
const DOUBLEBASEHP=DOC.getElementById("double_base_hp");
const DIFFICULTY_DOUBLEDAMAGESCALING=DOC.getElementById("double_damage_scaling");
const DIFFICULTY_NOUPGRADES=DOC.getElementById("no_upgrades");
const DIFFICULTY_UNLUCKY=DOC.getElementById("unlucky");
const DIFFICULTY_WEAK_STRIKES=DOC.getElementById("weak_strikes");
const DIFFICULTY_SOULLINK=DOC.getElementById("soullink");
const DIFFICULTY_ENCHANTLIMIT=DOC.getElementById("enchant_limit");
const DIFFICULTY_ARMORFALLOFF=DOC.getElementById("armor_falloff");

//difficulty presets
const PRESET1_TOUGHGUYS=DOC.getElementById("difficulty_preset_1");
const PRESETS=DOC.getElementsByClassName("difficulty_preset");
//settings
const SETTINGS_ATTACKINTERVAL=DOC.getElementById("attack_interval_setting");
Console("Turn based game/Scripts/elements.js loaded");