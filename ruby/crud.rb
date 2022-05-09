movies = {
RRR: 8,
Anukokunda_Okka_Roju: 9,
Jai_Bhim: 9,

}
puts " What would you like to do? Options: (add)(update)(delete)(list)"
choice = gets.chomp

case choice

when "add"
puts "What movie would you like to add to your hash?"
title = gets.chomp
if movies[title.to_sym] .nil?
puts "What rating do you give this book? (Between 1 and 10)"
rating = gets.chomp
movies[title.to_sym] = rating.to_i
puts "#{title} has been added to your hash with a rating of #{rating}"
else puts "That movie is already in your hash!"
end

when "update"
puts "which Movie rating would you like to change? "
title = gets.chomp
if movies[title.to_sym] .nil?
puts " Error! Movie not found!"
else puts "What new rating would you give it ?"
rating = gets.chomp
movies[title.to_sym] = rating.to_i
puts "Your rating for #{title} has been updated to #{rating} !"
end

when "delete"
puts "What title would you like removed?"
title = gets.chomp.to_sym
if movies [title.to_sym] .nil?
puts "That title doesn't exist anyway. "
else movies.delete(title)
end

when "list"
movies.each do |movie,rating|
puts "#{movie}:#{rating}"
end

else
puts "Error! you 've broken something!:("
end

puts movies