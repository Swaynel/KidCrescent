const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.onNewUser = functions.auth.user().onCreate(async (user) => {
  await admin.firestore().collection('users').doc(user.uid).set({
    email: user.email,
    displayName: user.displayName,
    role: 'fan',
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });
});

exports.updatePlayCount = functions.firestore
  .document('plays/{playId}')
  .onCreate(async (snap, context) => {
    const playData = snap.data();
    
    await admin.firestore()
      .collection('tracks')
      .doc(playData.trackId)
      .update({
        'stats.plays': admin.firestore.FieldValue.increment(1)
      });
  });

exports.onNewRelease = functions.firestore.document('releases/{id}').onCreate(async (snap) => {
  const release = snap.data();
  const payload = {
    notification: {
      title: 'New Release',
      body: `Check out ${release.title}`
    }
  };
  await admin.messaging().sendToTopic('new_releases', payload);
});