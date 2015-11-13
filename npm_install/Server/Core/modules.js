// modules are just listening to events, not referenced by any other;
define([
  'creanvas/Core/logger',

  'creanvas/ClientCommunication/clientUpdater',
  'creanvas/ClientCommunication/clientMessenger',
  'creanvas/ClientCommunication/clientEventReceiver',

  'creanvas/CollisionSolver/collisionSolver',
  'creanvas/CollisionSolver/broadPhaseProcessor',
  'creanvas/CollisionSolver/broadTile',
  'creanvas/CollisionSolver/narrowPhaseCollisionChecker',
  'creanvas/CollisionSolver/narrowPhaseCollisionHandler',

  'creanvas/Elements/element',
  'creanvas/Elements/elementEventChecker',
  'creanvas/Elements/elementEventHandler',

  'creanvas/Elements/ElementClasses/speedMover',
  'creanvas/Elements/ElementClasses/targetMover',
  'creanvas/Elements/ElementClasses/mover',
  'creanvas/Elements/ElementClasses/scaler',
  'creanvas/Elements/ElementClasses/draggable',
  'creanvas/Elements/ElementClasses/clickable',
  'creanvas/Elements/ElementClasses/droppable',
  'creanvas/Elements/ElementClasses/dropZone',
  'creanvas/Elements/ElementClasses/generator',
  'creanvas/Elements/ElementClasses/limitHandler',

  'creanvas/Elements/ElementTypes/circular',
  'creanvas/Elements/ElementTypes/box',
], function () {
});
