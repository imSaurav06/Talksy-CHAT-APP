import jwt from "jsonwebtoken"

// token genetate Token
export const generateToken = (userId,res)=>{

  //yha ek token generate hoga jb user sighnUp krega JWT_secrete _key ke sath 
  // token ki validaty 7 day hogi hoga
  const  token =jwt.sign({userId},process.env.JWT_SECRET, {
        expiresIn: "7d"
    })
 
    // token sending it to user
    res.cookie("jwt",token,{
        maxAge : 7*24*60*60*1000, // age in mili seccond MS
        httpOnly : true, //prevent XSS attacks cross-side scripting atttacks
        sameSite:"strict", //CSRF attacks cross-site request forgery attacks
        Secure: process.env.NODE_ENV !== "development"
    })

    return token;
}


{/* import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // MS
    httpOnly: true, // prevent XSS attacks cross-site scripting attacks
    sameSite: "strict", // CSRF attacks cross-site request forgery attacks
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};*/}