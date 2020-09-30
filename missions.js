// Numbers refer to pieces via the following
// 0 - I
// 1 - J
// 2 - L
// 3 - O
// 4 - S
// 5 - T
// 6 - Z

// A mission is a tuple where the first entry is the sequence of pieces to be played
// The second entry is a tuple where the first is the longest combo that can be earned
//  and the second is if finishing with an all clear is possible (0 is no, 1 is yes)
var missions = [
  [[0,0,0,0,0],[5,1]],
  [[5,5,5,5],[3,1]],
  [[6,3,3,3,3,3,3],[6,0]],
  [[2,1,2,1,2,1,2,1,2,1],[9,1]],
  [[5,4,6,4,4,6,4,6,5,1],[9,1]],
  [[1,0,2,3],[3,1]],
  [[5,1,5,4],[3,1]],
  [[5,5,2,5,5,3],[5,1]],
  [[3,0,3,6,5,2,6,2],[7,1]],
  [[0,5,2,3],[3,1]],
  [[0,5,3,1,2],[4,1]],
  [[6,5,4,3,3,3],[5,0]]

]


// a list to keep track of mission rankings
var missionsRecord = Array.from('F'.repeat(missions.length));

