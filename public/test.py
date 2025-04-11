s="abcabcbb"
def slove(s):
    newSet=set()
    maxLength=0
    for i in range(len(s)):
        if(s[i] not in newSet):
            newSet.add(s[i])
            maxLength=max(len(newSet),maxLength)
        else:
            newSet=set()
            continue
    return maxLength
    
print(slove(s))