// This script contains the "cartridges" used for
// text messages in the messages app

// A list of the text message events used throughout the game
// Formatting: character_total text count_current path_tag_tagInfo_text content
// Choices are formatted as line_pathInt
// Choices printed to text message button are handled in the button handler
// Each choice button is tagged with its corresponding path value
const textMessageCartridgeList = {
  "Jack.t1":
    ["Jack_in_0_0_tag_tagInfo_Did you make it all right, Trace?",
      "Jack_out_1_0_tag_tagInfo_Jack - Are you all right? Did you jump to the right dimension?",
      "Jack_in_2_0_tag_tagInfo_Yes, I'm fine, as far as being fine goes. Good to hear from you, Trace - I was getting worried. Where are you?",
      "Jack_out_3_0_tag_tagInfo_I dropped my telephone in the bustle, but it's fine now. I'm in a pocket dimension called Quartzmouth. It seems the slipstream may have sent me a little offcourse.",
      "Jack_in_4_0_tag_tagInfo_Oh good - you're not far then. I saw teletaxis going to Quartzmouth around lunchtime",
      "Jack_out_5_0_tag_tagInfo_Yes, I hear the lunch service is great here",
      "Jack_in_6_0_tag_tagInfo_Good to know. We'll have to try it once we get back the most valuable gem in the known multiverse.",
      "Jack_out_7_0_tag_tagInfo_I'm glad to see that the slipstream sickness hasn't sapped you of your wit",
      "Jack_in_8_0_tag_tagInfo_Quite, but it's not all sanguine here",
      "Jack_out_9_0_tag_tagInfo_I would imagine not, if it's a nest for ne'er-do-wells as we thought",
      "Jack_in_10_0_tag_tagInfo_No, I mean, I'm going to need a bit of assistance", // zoom out
      // Choice
      "Jack_in_11_0_choice_Jack.c1_Right.", // Choice flag
      "Jack_out_12_0_tag_tagInfo_Of course, just text me your location and I'll be there post-haste", // Just say where_0
      "Jack_out_12_1_tag_tagInfo_Wait, is something wrong?", // Is something wrong?_1
      "Jack_in_13_0_tag_tagInfo_That's just it - you won't be able",
      "Jack_in_13_1_tag_tagInfo_...That is one way to describe the situation, yes",
      "Jack_in_14_0_tag_tagInfo_hang on, I'll send the coordinates now. Text you later. Make haste.",
      "Jack_in_14_1_tag_tagInfo_No time, sending coordinates. make haste",
      "Jack_out_15_0_tag_tagInfo_Right, I'll be there before you know it.",
      "Jack_out_15_1_tag_tagInfo_Hang tight Jack - I'll be there in a jiffy!.",
      "Jack_out_15_1_tag_tagInfo_Hang tight Jack - I'll be there in a jiffy!."
      // Erroneous behavior - requires duplicate last path message
    ]
}
