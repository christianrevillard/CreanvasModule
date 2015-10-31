define(['./AxeAlignedBoxCircleCollision', './CircleCircleCollision'], function (boxCircle, circleCircle) {
  
  return function (e1, e2) {
    
    if (e1.circular && e2.circular)
      return new circleCircle(e1, e2);
    
    if ((e1.box && e2.circular) || (e2.box && e1.circular))
      return new boxCircle(e1.box?e1:e2, e1.box?e2:e1);
  };
});

